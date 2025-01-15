import { createServerFn } from "@tanstack/start";
import { addDays } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { houseMember, houseInvite } from "~/lib/server/schema";
import type { UserRole } from "~/lib/server/schema/types";

export const updateHouseMember = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         houseId: z.number(),
         memberId: z.string(),
         role: z.enum(["admin", "member"]),
      }),
   )
   .handler(async ({ data, context }) => {
      const adminMember = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, data.houseId),
            eq(houseMember.userId, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!adminMember) throw new Error("Not authorized to update members");

      const [member] = await db
         .update(houseMember)
         .set({
            role: data.role,
         })
         .where(
            and(
               eq(houseMember.houseId, data.houseId),
               eq(houseMember.userId, data.memberId),
            ),
         )
         .returning();

      return member;
   });

export const inviteToHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         houseId: z.number(),
         email: z.string().email(),
         role: z.enum(["admin", "member"]),
      }),
   )
   .handler(async ({ data, context }) => {
      // Check if inviter is admin
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, data.houseId),
            eq(houseMember.userId, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to invite members");

      // Check for existing pending invite
      const existingInvite = await db.query.houseInvite.findFirst({
         where: and(
            eq(houseInvite.houseId, data.houseId),
            eq(houseInvite.inviteeEmail, data.email),
            eq(houseInvite.status, "pending"),
         ),
      });

      if (existingInvite) throw new Error("Invite already pending");

      // Create new invite
      const [invite] = await db
         .insert(houseInvite)
         .values({
            houseId: data.houseId,
            inviterId: context.auth.user!.id,
            inviteeEmail: data.email,
            role: data.role,
            expiresAt: addDays(new Date(), 7),
         })
         .returning();

      return invite;
   });

export const acceptHouseInvite = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string()) // Invite ID
   .handler(async ({ data: inviteId, context }) => {
      return await db.transaction(async (tx) => {
         // Get and validate invite
         const invite = await tx.query.houseInvite.findFirst({
            where: and(eq(houseInvite.id, inviteId), eq(houseInvite.status, "pending")),
         });

         if (!invite) throw new Error("Invalid or expired invite");
         if (invite.inviteeEmail !== context.auth.user!.email) {
            throw new Error("Invite not for this user");
         }
         if (new Date() > invite.expiresAt) {
            throw new Error("Invite expired");
         }

         // Add user as house member
         const [member] = await tx
            .insert(houseMember)
            .values({
               houseId: invite.houseId,
               userId: context.auth.user!.id,
               role: invite.role as UserRole,
            })
            .returning();

         // Update invite status
         await tx
            .update(houseInvite)
            .set({ status: "accepted" })
            .where(eq(houseInvite.id, inviteId));

         return member;
      });
   });

export const rejectHouseInvite = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string()) // Invite ID
   .handler(async ({ data: inviteId, context }) => {
      const invite = await db.query.houseInvite.findFirst({
         where: eq(houseInvite.id, inviteId),
      });

      if (!invite || invite.inviteeEmail !== context.auth.user!.email) {
         throw new Error("Invalid invite");
      }

      const [updated] = await db
         .update(houseInvite)
         .set({ status: "rejected" })
         .where(eq(houseInvite.id, inviteId))
         .returning();

      return updated;
   });

export const getHouseInvites = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId, context }) => {
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, houseId),
            eq(houseMember.userId, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to view invites");

      return db.query.houseInvite.findMany({
         where: eq(houseInvite.houseId, houseId),
         with: {
            inviter: true,
         },
         orderBy: (invite) => [desc(invite.createdAt)],
      });
   });

import { createServerFn } from "@tanstack/start";
import { addDays } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import {
   type HouseForm,
   HouseFormSchema,
   type HouseInviteForm,
   HouseInviteFormSchema,
   type HouseMemberForm,
   HouseMemberFormSchema,
   houseInvite,
   houseMember,
   house as houseTable,
} from "~/lib/server/schema";
import { createDefaultLocations } from "~/lib/server/utils/defaultLocations";

// Create a new house
export const addHouse = createServerFn()
   .middleware([authMiddleware])
   .validator((data: HouseForm) => HouseFormSchema.parse(data))
   .handler(async ({ data, context }) => {
      const houseId = ulid();

      return await db.transaction(async (tx) => {
         const [house] = await tx
            .insert(houseTable)
            .values({
               id: houseId,
               name: data.name,
               owner_id: context.auth.user!.id,
            })
            .returning();

         await tx.insert(houseMember).values({
            id: ulid(),
            house_id: houseId,
            user_id: context.auth.user!.id,
            role: "admin",
         });

         const locations = await createDefaultLocations(houseId);

         return { house, locations };
      });
   });

// Update house
export const updateHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         houseId: z.string(),
         name: z.string().min(2).max(50),
      }),
   )
   .handler(async ({ data: { houseId, name }, context }) => {
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.house_id, houseId),
            eq(houseMember.user_id, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to update house");

      const [house] = await db
         .update(houseTable)
         .set({
            name,
            updated_at: new Date(),
         })
         .where(eq(houseTable.id, houseId))
         .returning();

      return house;
   });

// Delete house
export const deleteHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: houseId, context }) => {
      const house = await db.query.house.findFirst({
         where: eq(houseTable.id, houseId),
      });

      if (!house || house.owner_id !== context.auth.user!.id) {
         throw new Error("Not authorized to delete house");
      }

      await db.delete(houseTable).where(eq(houseTable.id, houseId));
      return { success: true };
   });

// Update house member
export const updateHouseMember = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         houseId: z.string(),
         memberId: z.string(),
         role: z.enum(["admin", "member"]),
      }),
   )
   .handler(async ({ data: { houseId, memberId, role }, context }) => {
      const adminMember = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.house_id, houseId),
            eq(houseMember.user_id, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!adminMember) throw new Error("Not authorized to update members");

      const [member] = await db
         .update(houseMember)
         .set({
            role,
            updated_at: new Date(),
         })
         .where(and(eq(houseMember.house_id, houseId), eq(houseMember.user_id, memberId)))
         .returning();

      return member;
   });

export const inviteToHouse = createServerFn()
   .middleware([authMiddleware])
   .validator((data: HouseInviteForm) => HouseInviteFormSchema.parse(data))
   .handler(async ({ data, context }) => {
      // Check if inviter is admin
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.house_id, data.houseId),
            eq(houseMember.user_id, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to invite members");

      // Check for existing pending invite
      const existingInvite = await db.query.houseInvite.findFirst({
         where: and(
            eq(houseInvite.house_id, data.houseId),
            eq(houseInvite.invitee_email, data.email),
            eq(houseInvite.status, "pending"),
         ),
      });

      if (existingInvite) throw new Error("Invite already pending");

      // Create new invite
      const [invite] = await db
         .insert(houseInvite)
         .values({
            id: ulid(),
            house_id: data.houseId,
            inviter_id: context.auth.user!.id,
            invitee_email: data.email,
            role: data.role,
            expires_at: addDays(new Date(), 7), // Expires in 7 days
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
         if (invite.invitee_email !== context.auth.user!.email) {
            throw new Error("Invite not for this user");
         }
         if (new Date() > invite.expires_at) {
            throw new Error("Invite expired");
         }

         // Add user as house member
         const [member] = await tx
            .insert(houseMember)
            .values({
               id: ulid(),
               house_id: invite.house_id,
               user_id: context.auth.user!.id,
               role: invite.role,
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

      if (!invite || invite.invitee_email !== context.auth.user!.email) {
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
   .validator(z.string()) // House ID
   .handler(async ({ data: houseId, context }) => {
      // Check if user is admin
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.house_id, houseId),
            eq(houseMember.user_id, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to view invites");

      return db.query.houseInvite.findMany({
         where: eq(houseInvite.house_id, houseId),
         with: {
            inviter: true,
         },
         orderBy: (invite) => [desc(invite.created_at)],
      });
   });

// Add this new function to create a default house
export const createDefaultHouse = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      const houseId = ulid();

      return await db.transaction(async (tx) => {
         const [house] = await tx
            .insert(houseTable)
            .values({
               id: houseId,
               name: "My House",
               owner_id: context.auth.user!.id,
            })
            .returning();

         await tx.insert(houseMember).values({
            id: ulid(),
            house_id: houseId,
            user_id: context.auth.user!.id,
            role: "admin",
         });

         const locations = await createDefaultLocations(houseId);

         return { house, locations };
      });
   });

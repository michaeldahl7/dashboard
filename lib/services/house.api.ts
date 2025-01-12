import { createServerFn } from "@tanstack/start";
import { addDays } from "date-fns";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import {
   type HouseInviteForm,
   HouseInviteFormSchema,
   houseInvite,
   houseMember,
   house as houseTable,
   user as userTable,
} from "~/lib/server/schema";
import { createDefaultLocations } from "~/lib/server/utils/defaultLocations";
import type { UserRole } from "../server/schema/types";
import { KitchenError } from "../server/utils/errors";

// Create a new house
export const addHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         name: z.string().min(2).max(50),
         setAsCurrent: z.boolean().default(true),
      }),
   )
   .handler(async ({ context, data }) => {
      const { name, setAsCurrent } = data;

      const [house] = await db
         .insert(houseTable)
         .values({
            name,
            ownerId: context.auth.user.id,
         })
         .returning();

      if (!house) {
         throw new KitchenError("Failed to create house", "HOUSE_CREATION_FAILED");
      }

      await db.insert(houseMember).values({
         houseId: house.id,
         userId: context.auth.user.id,
         role: "admin",
      });

      const locations = await createDefaultLocations(house.id);

      if (setAsCurrent) {
         await db
            .update(userTable)
            .set({
               currentHouseId: house.id,
            })
            .where(eq(userTable.id, context.auth.user.id));

         // Return the house with role for consistency with other queries
         return {
            house: {
               ...house,
               role: "admin" as const,
            },
            locations,
         };
      }

      return { house, locations };
   });

// Update house
export const updateHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         houseId: z.number(),
         name: z.string().min(2).max(50),
      }),
   )
   .handler(async ({ data: { houseId, name }, context }) => {
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, houseId),
            eq(houseMember.userId, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to update house");

      const [house] = await db
         .update(houseTable)
         .set({ name })
         .where(eq(houseTable.id, houseId))
         .returning();

      return house;
   });

// Delete house
export const deleteHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId, context }) => {
      const house = await db.query.house.findFirst({
         where: eq(houseTable.id, houseId),
      });

      if (!house || house.ownerId !== context.auth.user!.id) {
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
         houseId: z.number(),
         memberId: z.string(),
         role: z.enum(["admin", "member"]),
      }),
   )
   .handler(async ({ data: { houseId, memberId, role }, context }) => {
      const adminMember = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, houseId),
            eq(houseMember.userId, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!adminMember) throw new Error("Not authorized to update members");

      const [member] = await db
         .update(houseMember)
         .set({
            role,
         })
         .where(and(eq(houseMember.houseId, houseId), eq(houseMember.userId, memberId)))
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

export const getCurrentHouse = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      if (!context.auth.user.currentHouseId) {
         throw new KitchenError("No current house selected", "NO_CURRENT_HOUSE");
      }

      const result = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, context.auth.user.currentHouseId),
            eq(houseMember.userId, context.auth.user.id),
         ),
         with: {
            house: {
               with: {
                  owner: true,
               },
            },
         },
      });

      if (!result) {
         throw new KitchenError("House not found", "HOUSE_NOT_FOUND");
      }

      return {
         ...result.house,
         role: result.role,
      };
   });

export const getUserHouses = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      const results = await db.query.houseMember.findMany({
         where: eq(houseMember.userId, context.auth.user.id),
         with: {
            house: {
               with: {
                  owner: true,
               },
            },
         },
      });

      return results.map((member) => ({
         ...member.house,
         role: member.role,
      }));
   });

export const updateUser = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         currentHouseId: z.number(),
      }),
   )
   .handler(async ({ context, data }) => {
      const [user] = await db
         .update(userTable)
         .set({ currentHouseId: data.currentHouseId })
         .where(eq(userTable.id, context.auth.user!.id))
         .returning();

      return user;
   });

// Create default house for new users
export const createDefaultHouse = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      const [house] = await db
         .insert(houseTable)
         .values({
            name: "My House",
            ownerId: context.auth.user.id,
         })
         .returning();

      if (!house) {
         throw new KitchenError("Failed to create house", "HOUSE_CREATION_FAILED");
      }

      // Add user as admin member
      await db.insert(houseMember).values({
         houseId: house.id,
         userId: context.auth.user.id,
         role: "admin",
      });

      // Create default locations
      const locations = await createDefaultLocations(house.id);

      // Set as current house
      await db
         .update(userTable)
         .set({ currentHouseId: house.id })
         .where(eq(userTable.id, context.auth.user.id));

      return {
         house: {
            ...house,
            role: "admin" as const,
         },
         locations,
      };
   });

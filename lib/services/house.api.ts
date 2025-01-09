import { createServerFn } from "@tanstack/start";
import { ulid } from "ulid";
import { z } from "zod";
import { db } from "~/lib/server/db";
import { eq, and, gt } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
  house as houseTable,
  HouseFormSchema,
  houseMember,
  houseInvite,
  user as userTable,
  type HouseForm,
} from "~/lib/server/schema";
import { createDefaultInventories } from "~/lib/server/utils/defaultInventory";

// Create a new house
export const addHouse = createServerFn()
  .middleware([authMiddleware])
  .validator((data: HouseForm) => HouseFormSchema.parse(data))
  .handler(async ({ data, context }) => {
    const houseId = ulid();
    
    return await db.transaction(async (tx) => {
      const [house] = await tx.insert(houseTable).values({
        id: houseId,
        name: data.name,
        owner_id: context.auth.user!.id,
      }).returning();

      await tx.insert(houseMember).values({
        id: ulid(),
        house_id: houseId,
        user_id: context.auth.user!.id,
        role: "admin",
      });

      const [user] = await tx.update(userTable)
        .set({ currentHouseId: houseId })
        .where(eq(userTable.id, context.auth.user!.id))
        .returning();

      const inventories = await createDefaultInventories(houseId);

      return { house, user, inventories };
    });
  });

// Get houses for current user
export const getHouses = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return db.query.houseMember.findMany({
      where: eq(houseMember.user_id, context.auth.user!.id),
      with: {
        house: true
      }
    });
  });

// Invite a user to a house
export const inviteToHouse = createServerFn()
  .middleware([authMiddleware])
  .validator(z.object({
    houseId: z.string(),
    email: z.string().email(),
  }))
  .handler(async ({ data, context }) => {
    const member = await db.query.houseMember.findFirst({
      where: and(
        eq(houseMember.house_id, data.houseId),
        eq(houseMember.user_id, context.auth.user!.id),
        eq(houseMember.role, "admin")
      )
    });

    if (!member) {
      throw new Error("Not authorized to invite");
    }

    const [invite] = await db.insert(houseInvite).values({
      id: ulid(),
      house_id: data.houseId,
      invited_email: data.email,
      invited_by_id: context.auth.user!.id,
      status: "pending",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).returning();

    return invite;
  });

// Accept a house invitation
// export const acceptInvite = createServerFn()
//   .middleware([authMiddleware])
//   .validator(z.object({
//     inviteId: z.string(),
//   }))
//   .handler(async ({ data, context }) => {
//     const invite = await db.query.houseInvite.findFirst({
//       where: and(
//         eq(houseInvite.id, data.inviteId),
//         eq(houseInvite.status, "pending"),
//         gt(houseInvite.expiresAt, new Date())
//       )
//     });

//     if (!invite) {
//       throw new Error("Invalid or expired invite");
//     }

//     return await db.transaction(async (tx) => {
//       await tx.update(houseInvite)
//         .set({ status: "accepted" })
//         .where(eq(houseInvite.id, data.inviteId));

//       await tx.insert(houseMember).values({
//         id: ulid(),
//         house_id: invite.houseId,
//         user_id: context.auth.user!.id,
//         role: "member",
//       });

//       const user = await tx.query.user.findFirst({
//         where: eq(userTable.id, context.auth.user!.id)
//       });

//       if (!user?.currentHouseId) {
//         await tx.update(userTable)
//           .set({ currentHouseId: invite.houseId })
//           .where(eq(userTable.id, context.auth.user!.id));
//       }

//       return invite;
//     });
//   });

// // Get pending invites for current user's email
// export const getPendingInvites = createServerFn()
//   .middleware([authMiddleware])
//   .handler(async ({ context }) => {
//     return db.query.houseInvite.findMany({
//       where: and(
//         eq(houseInvite.invitedEmail, context.auth.user!.email),
//         eq(houseInvite.status, "pending"),
//         gt(houseInvite.expiresAt, new Date())
//       ),
//       with: {
//         house: true,
//         invitedBy: true
//       }
//     });
//   }); 
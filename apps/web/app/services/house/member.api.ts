import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/middleware/auth-guard";
import { db } from "@munchy/db/client";
import { houseMember } from "@munchy/db/schema";

const getAllMembers = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db.query.houseMember.findMany({
         where: eq(houseMember.houseId, houseId),
         with: {
            user: true,
         },
      });
   });

const updateMember = createServerFn()
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
            eq(houseMember.userId, context.auth.user.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!adminMember) throw new Error("Not authorized to update members");

      const [member] = await db
         .update(houseMember)
         .set({ role: data.role })
         .where(
            and(
               eq(houseMember.houseId, data.houseId),
               eq(houseMember.userId, data.memberId),
            ),
         )
         .returning();

      return member;
   });

export const memberApi = {
   getAll: getAllMembers,
   update: updateMember,
};

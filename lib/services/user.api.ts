import { createServerFn } from "@tanstack/start";
import { db } from "~/lib/server/db";
import type { InsertUser } from "~/lib/server/db";
import { user as userTable } from "~/lib/server/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { z } from "zod";
import { ulid } from "ulid";
import { UserFormSchema } from "~/lib/server/schema/user.schema";
import type { UserForm } from "~/lib/server/schema/user.types";
// import type { SelectUser } from "~/lib/server/db/schema";

// export const getUser = createServerFn()
//   .middleware([authMiddleware])
//   .handler(async ({ context }) => {
//     const user = await db.query.user.findFirst({
//       where: eq(userTable.id, context.auth.user.id)
//     });

//     if (!user) throw new Error('User not found');
//     return user;
//   });

export const checkUsername = createServerFn()
   .validator(
      z.object({
         username: z.string(),
      }),
   )
   .handler(async ({ data }) => {
      const exists = await db.query.user.findFirst({
         where: eq(userTable.username, data.username),
      });
      return { exists: Boolean(exists) };
   });

export const updateOnboardingStatus = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         userId: z.string(),
         updates: z.object({
            username: z.string().optional(),
            isOnboarded: z.boolean().optional(),
            currentHouseId: z.string().optional(),
         }),
      }),
   )
   .handler(async ({ data }) => {
      return db
         .update(userTable)
         .set(data.updates)
         .where(eq(userTable.id, data.userId))
         .returning();
   });

export const updateOnboardingStep = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         userId: z.string(),
         step: z.enum(["username", "house", "inventory", "completed"]),
      }),
   )
   .handler(async ({ data }) => {
      const [user] = await db
         .update(userTable)
         .set({ onboardingStep: data.step })
         .where(eq(userTable.id, data.userId))
         .returning();
      return user;
   });

export const getUsers = createServerFn()
   // .middleware([authMiddleware])
   .handler(async ({ context }) => {
      const users = await db.query.user.findMany();
      return users;
   });

export const addUser = createServerFn()
   .validator((data: UserForm) => UserFormSchema.parse(data))
   .handler(async ({ data }) => {
      const userData: InsertUser = {
         id: ulid(),
         name: data.name,
         email: data.email,
         username: data.username,
         emailVerified: false,
         createdAt: new Date(),
         updatedAt: new Date(),
         onboardingStep: "initial",
      };
      return db.insert(userTable).values(userData).returning();
   });

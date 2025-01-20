import { z } from "zod";

// export const unused = z.string().describe(
//    `This lib is currently not used as we use drizzle-zod for simple schemas
//    But as your application grows and you need other validators to share
//    with back and frontend, you can put them in here
//   `,
// );

export const locationInsertSchema = z.object({
   name: z.string().min(1),
   typeId: z.number().min(1),
   houseId: z.number().min(1),
   description: z.string().optional(),
});

import { z } from "zod";

export const UserFormSchema = z.object({
   name: z.string().min(1),
   email: z.string().email(),
   username: z.string().min(1),
});

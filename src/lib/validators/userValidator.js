import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),

  assignedWork: z
    .array(
      z.object({
        name: z.enum(["work1", "work2", "work3"]),
      })
    )
    .optional(),
});



//note: use passthrough() if there are extra fields to be allowed if neccessary
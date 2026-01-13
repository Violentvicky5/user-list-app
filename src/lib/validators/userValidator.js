import { z } from "zod";


export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
   assignedWork: z.enum(["work1", "work2", "work3"]).optional(),

});


//note: use passthrough() if there are extra fields to be allowed if neccessary
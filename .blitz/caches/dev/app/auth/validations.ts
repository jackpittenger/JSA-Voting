import * as z from "zod";

export const LoginInput = z.object({
  token: z.string().min(2).max(48),
  pin: z.string().length(7),
});

export type LoginInputType = z.infer<typeof LoginInput>;

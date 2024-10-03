import { z } from "zod";

export type RegisterRewardRequest = z.infer<typeof RegisterRewardRequestSchema>;
export const RegisterRewardRequestSchema = z.object({});

export type RegisterRewardResponse = z.infer<
  typeof RegisterRewardRequestSchema
>;
export const RegisterRewardResponseSchema = z.object({});

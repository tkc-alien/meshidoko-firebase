import { z } from "zod";

export type ConsumeRewardRequest = z.infer<typeof ConsumeRewardRequestSchema>;
export const ConsumeRewardRequestSchema = z.object({});

export type ConsumeRewardResponse = z.infer<typeof ConsumeRewardResponseSchema>;
export const ConsumeRewardResponseSchema = z.object({});

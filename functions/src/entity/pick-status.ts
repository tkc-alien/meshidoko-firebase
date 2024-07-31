import { z } from "zod";

/** 獲得リワード情報 */
export type EarnedReward = z.infer<typeof EarnedRewardSchema>;
export const EarnedRewardSchema = z.object({
  rewardId: z.string().min(1),
  earnedAt: z.coerce.date(),
});

/** 使用済みリワード情報 */
export type UsedReward = z.infer<typeof UsedRewardSchema>;
export const UsedRewardSchema = z.object({
  rewardId: z.string().min(1),
  usedAt: z.coerce.date(),
});

/** 抽選ステータス情報 */
export type PickStatus = z.infer<typeof PickStatusSchema>;
export const PickStatusSchema = z.object({
  cacheId: z.string().min(1),
  pickedAt: z.coerce.date(),
  earnedReward: EarnedRewardSchema.optional(),
  usedRewards: z.array(UsedRewardSchema).optional(),
});

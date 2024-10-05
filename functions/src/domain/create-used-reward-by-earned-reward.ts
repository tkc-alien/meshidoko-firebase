import { EarnedReward, UsedReward } from "@/entity/pick-status";

export type Input = {
  earnedReward: EarnedReward;
  now: Date;
};

export type Output = UsedReward;

/**
 * 獲得リワードから使用リワードを生成する
 * @param { Input } input
 * @return { Output }
 */
export function createUsedRewardByEarnedReward(input: Input): Output {
  return {
    rewardId: input.earnedReward.rewardId,
    usedAt: input.now,
  };
}

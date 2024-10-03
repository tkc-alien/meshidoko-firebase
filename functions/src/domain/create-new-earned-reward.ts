import { ulid } from "ulidx";

import { EarnedReward } from "@/entity/pick-status";

export type Input = {
  now: Date;
};

export type Output = EarnedReward;

/**
 * 新規の獲得リワードを作成する
 * @param { Input } input
 * @return { EarnedReward }
 */
export function createNewEarnedReward(input: Input): Output {
  const earnedReward: EarnedReward = {
    rewardId: ulid(),
    earnedAt: input.now,
  };
  return earnedReward;
}

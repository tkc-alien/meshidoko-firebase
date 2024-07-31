import { maxRewardCount } from "@/const";
import { PickStatus } from "@/entity/pick-status";

type Input = {
  pickStatus: PickStatus;
};

type Output = number;

/**
 * 残りリワード使用回数を取得する
 * @param { Input } input
 * @return { Output }
 */
export function getRemainginRewardCount(input: Input): Output {
  const currentCount = input.pickStatus.usedRewards?.length ?? 0;
  return Math.max(maxRewardCount - currentCount, 0);
}

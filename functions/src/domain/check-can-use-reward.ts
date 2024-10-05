import { maxRewardCount } from "@/const";
import { PickStatus } from "@/entity/pick-status";

export type Input = {
  pickStatus?: PickStatus;
};

export type Output = boolean;

/**
 * リワード使用が可能であるか判定する
 * @param { Input } input
 * @return { Output }
 */
export function checkCanUseReward(input: Input): Output {
  // 前回の抽選がない場合は許可しない
  if (!input.pickStatus) {
    return false;
  }
  // 獲得リワードがない場合は許可しない
  if (!input.pickStatus.earnedReward) {
    return false;
  }
  // 使用リワードが最大数に達している場合は許可しない
  if (input.pickStatus.usedRewards && input.pickStatus.usedRewards.length >= maxRewardCount) {
    return false;
  }
  // それ以外は許可する
  return true;
}

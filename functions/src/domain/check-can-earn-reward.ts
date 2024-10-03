import { PickStatus } from "@/entity/pick-status";

type Input = {
  pickStatus?: PickStatus;
};

type Output = boolean;

/**
 * リワード獲得が可能であるか判定する
 * @param { Input } input
 * @return { Output }
 */
export function checkCanEarnReward(input: Input): Output {
  // 前回の抽選がない場合は許可しない
  if (!input.pickStatus) {
    return false;
  }
  // 既に獲得リワードが登録されている場合は許可しない
  if (input.pickStatus.earnedReward) {
    return false;
  }
  // それ以外は許可する
  return true;
}

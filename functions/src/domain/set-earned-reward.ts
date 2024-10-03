import { getDatabase } from "firebase-admin/database";

import { EarnedReward } from "@/entity/pick-status";
import { UID } from "@/entity/user";
import { InvalidArgumentError } from "@/error/app-errors";

export type Input = {
  uid: UID;
  earnedReward: EarnedReward;
};

export type Output = void;

/**
 * 獲得リワードを更新する
 * @param { Input } input
 */
export async function setEarnedReward(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.uid.length === 0 || input.earnedReward.rewardId.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // データ更新
  const data = JSON.parse(JSON.stringify(input.earnedReward));
  await getDatabase().ref("users").child(input.uid).child("pickStatus").child("earnedReward").set(data);
}

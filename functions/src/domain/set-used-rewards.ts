import { getDatabase } from "firebase-admin/database";

import { UsedReward } from "@/entity/pick-status";
import { UID } from "@/entity/user";
import { InvalidArgumentError } from "@/error/app-errors";

export type Input = {
  uid: UID;
  usedRewards: UsedReward[] | undefined;
};

export type Output = void;

/**
 * 使用リワードを更新する
 * @param { Input } input
 * @return { Output }
 */
export async function setUsedRewards(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.uid.length === 0 || input.usedRewards?.some((v) => v.rewardId.length === 0)) {
    throw new InvalidArgumentError(input);
  }
  // データ更新
  const data = input.usedRewards === undefined ? {} : JSON.parse(JSON.stringify(input.usedRewards));
  await getDatabase().ref("users").child(input.uid).child("pickStatus").child("usedRewards").set(data);
}

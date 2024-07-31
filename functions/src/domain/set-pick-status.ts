import { getDatabase } from "firebase-admin/database";

import { PickStatus } from "@/entity/pick-status";
import { InvalidArgumentError } from "@/error/app-errors";

type Input = {
  uid: string;
  cacheId: string;
  now: Date;
};

type Output = PickStatus;

/**
 * 抽選ステータスを更新する
 * @param { Input } input
 * @return { Output }
 */
export async function setPickStatus(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.uid.length === 0 || input.cacheId.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // 抽選ステータスを作成
  const pickStatus: PickStatus = {
    cacheId: input.cacheId,
    pickedAt: input.now,
    earnedReward: undefined,
    usedRewards: undefined,
  };
  const data = JSON.parse(JSON.stringify(pickStatus));
  // データ更新
  await getDatabase()
    .ref("users")
    .child(input.uid)
    .child("pickStatus")
    .set(data);
  // 返却
  return pickStatus;
}

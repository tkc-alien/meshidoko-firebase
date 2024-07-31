import { getDatabase } from "firebase-admin/database";

import { PickStatus, PickStatusSchema } from "@/entity/pick-status";
import { InvalidArgumentError } from "@/error/app-errors";

type Input = {
  uid: string;
};

type Output = PickStatus | undefined;

/**
 * 抽選ステータスを取得する
 * @param { Input } input
 * @return { Output }
 */
export async function getPickStatus(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.uid.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // データ取得
  const snapshot = await getDatabase()
    .ref("users")
    .child(input.uid)
    .child("pickStatus")
    .get();
  const data = snapshot.val();
  const result = PickStatusSchema.safeParse(data);
  return result.data;
}

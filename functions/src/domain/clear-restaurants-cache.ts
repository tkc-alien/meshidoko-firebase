import { storage } from "firebase-admin";

import { InvalidArgumentError } from "@/error/app-errors";
import { filename } from "@/util/cache-utils";

type Input = {
  cacheId: string;
};

type Output = void;

/**
 * レストラン情報のキャッシュを削除する
 * @param { Input } input
 */
export async function clearRestaurantsCache(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.cacheId.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // キャッシュファイルを削除
  const bucket = storage().bucket();
  await bucket.file(filename(input.cacheId)).delete({ ignoreNotFound: true });
}

import { storage } from "firebase-admin";
import { ulid } from "ulidx";

import { Restaurant } from "@/entity/restaurant";
import { InvalidArgumentError } from "@/error/app-errors";
import { filename } from "@/util/cache-utils";

type Input = {
  restaurants: Restaurant[];
};

type Output = {
  cacheId: string;
};

/**
 * レストラン情報のキャッシュを保存する
 * @param { Input } input
 */
export async function storeRestaurantsCache(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.restaurants.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // キャッシュIDを生成
  const cacheId = ulid();
  // 保存
  const bucket = storage().bucket();
  const data = JSON.stringify(input.restaurants, undefined, 2);
  await bucket.file(filename(cacheId)).save(data);
  // 返却
  return { cacheId };
}

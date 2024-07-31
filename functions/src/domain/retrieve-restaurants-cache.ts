import "ts-array-extensions";

import { storage } from "firebase-admin";
import { z } from "zod";

import { Restaurant, RestaurantSchema } from "@/entity/restaurant";
import { InvalidArgumentError } from "@/error/app-errors";
import { filename } from "@/util/cache-utils";

type Input = {
  cacheId: string;
};

type Output = {
  restaurants: Restaurant[] | undefined;
};

/**
 * レストラン情報のキャッシュを読み出す
 * @param { Input } input
 */
export async function retrieveRestaurantsCache(input: Input): Promise<Output> {
  // 入力値チェック
  if (input.cacheId.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // キャッシュファイルを取得する
  const bucket = storage().bucket();
  const file = bucket.file(filename(input.cacheId));
  const exists = await file.exists();
  if (exists.first() !== true) {
    return { restaurants: undefined };
  }
  const response = await file.download();
  // ファイルをパースする
  try {
    const data = JSON.parse(response.toString());
    const parseResult = z.array(RestaurantSchema).safeParse(data);
    return { restaurants: parseResult.data };
  } catch (_) {
    return {
      restaurants: undefined,
    };
  }
}

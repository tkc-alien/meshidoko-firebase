import { z, ZodType } from "zod";

import { UID } from "@/entity/user";
import { InvalidRequestError, UnauthorizedError } from "@/error/app-errors";

export type RequestParams = {
  auth?: { uid: UID };
  data: unknown;
};

/**
 * リクエストパラメータを検証する
 * @param { ZodType } as
 * @param { RequestParams } params
 * @return { [UID, Request] }
 */
export function verify(
  as: ZodType,
  params: RequestParams
): [UID, z.infer<typeof as>] {
  // ユーザ認証
  const uid = params.auth?.uid;
  if (!uid) {
    throw new UnauthorizedError();
  }

  // バリデーション
  const parseResult = as.safeParse(params.data);
  if (parseResult.error) {
    throw new InvalidRequestError(parseResult.error.issues);
  }

  // 返却
  return [uid, parseResult.data];
}

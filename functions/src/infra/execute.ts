import * as logger from "firebase-functions/logger";
import { HttpsError } from "firebase-functions/v1/https";

import { AppError } from "@/error/app-errors";

/**
 * Functionの処理を安全に実行する
 * @param { function } handler
 */
export async function execute(
  handler: () => Promise<unknown>
): Promise<unknown> {
  try {
    return await handler();
  } catch (e) {
    if (e instanceof AppError) {
      if (e.internal) {
        logger.error({ ...e });
        throw new HttpsError("internal", e.message, {
          code: e.code,
          details: e.details,
        });
      } else {
        logger.warn({ ...e });
        throw new HttpsError("invalid-argument", e.message, {
          code: e.code,
          details: e.details,
        });
      }
    } else {
      logger.error(JSON.parse(JSON.stringify(e)));
      throw new HttpsError("unknown", "不明なエラーが発生しました。", {
        thrown: typeof e,
      });
    }
  }
}

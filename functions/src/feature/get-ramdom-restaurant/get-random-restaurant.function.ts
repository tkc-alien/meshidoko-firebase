import { CallableRequest } from "firebase-functions/lib/common/providers/https";
import { onCall } from "firebase-functions/v2/https";

import { GetRandomRestaurantRequestSchema } from "@/feature/get-ramdom-restaurant/get-random-restaurant.form";
import { getRandomRestaurantHandler } from "@/feature/get-ramdom-restaurant/get-random-restaurant.handler";
import { execute } from "@/infra/execute";
import { verify } from "@/infra/verify";

/**
 * 抽選API
 */
export const getRandomRestaurantFunction = onCall(
  async (callableRequest: CallableRequest) => {
    return await execute(async () => {
      const [uid, request] = verify(GetRandomRestaurantRequestSchema, {
        auth: callableRequest.auth,
        data: callableRequest.data,
      });
      const response = await getRandomRestaurantHandler(uid, request);
      return JSON.parse(JSON.stringify(response));
    });
  }
);

import { CallableRequest } from "firebase-functions/lib/common/providers/https";
import { onCall } from "firebase-functions/v2/https";

import { PickRestaurantRequestSchema } from "@/feature/pick-restaurant/pick-restaurant.form";
import { pickRestaurantHandler } from "@/feature/pick-restaurant/pick-restaurant.handler";
import { execute } from "@/infra/execute";
import { verify } from "@/infra/verify";

/**
 * 抽選API
 */
export const pickRestaurantFunction = onCall(
  async (callableRequest: CallableRequest) => {
    return await execute(async () => {
      const [uid, request] = verify(PickRestaurantRequestSchema, {
        auth: callableRequest.auth,
        data: callableRequest.data,
      });
      const response = await pickRestaurantHandler(uid, request);
      return JSON.parse(JSON.stringify(response));
    });
  }
);

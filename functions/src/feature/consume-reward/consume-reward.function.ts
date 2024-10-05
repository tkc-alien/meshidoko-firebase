import { CallableRequest, onCall } from "firebase-functions/v2/https";

import { ConsumeRewardRequestSchema } from "@/feature/consume-reward/consume-reward.form";
import { consumeRewardHandler } from "@/feature/consume-reward/consume-reward.handler";
import { execute } from "@/infra/execute";
import { verify } from "@/infra/verify";

/**
 * リワード使用API
 */
export const consumeRewardFunction = onCall(async (callableRequest: CallableRequest) => {
  return await execute(async () => {
    const [uid, request] = verify(ConsumeRewardRequestSchema, {
      auth: callableRequest.auth,
      data: callableRequest.data,
    });
    const response = await consumeRewardHandler(uid, request);
    return JSON.parse(JSON.stringify(response));
  });
});

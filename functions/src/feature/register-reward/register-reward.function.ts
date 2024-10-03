import { CallableRequest, onCall } from "firebase-functions/v2/https";

import { RegisterRewardRequestSchema } from "@/feature/register-reward/register-reward.form";
import { registerRewardHandler } from "@/feature/register-reward/register-reward.handler";
import { execute } from "@/infra/execute";
import { verify } from "@/infra/verify";

export const registerRewardFunction = onCall(async (callableRequest: CallableRequest) => {
  return await execute(async () => {
    const [uid, request] = verify(RegisterRewardRequestSchema, {
      auth: callableRequest.auth,
      data: callableRequest.data,
    });
    const response = await registerRewardHandler(uid, request);
    return JSON.parse(JSON.stringify(response));
  });
});

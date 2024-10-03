import { checkCanEarnReward } from "@/domain/check-can-earn-reward";
import { createNewEarnedReward } from "@/domain/create-new-earned-reward";
import { getPickStatus } from "@/domain/get-pick-status";
import { setEarnedReward } from "@/domain/set-earned-reward";
import { UID } from "@/entity/user";
import { UnavailableEarnRewardError } from "@/error/app-errors";
import { RegisterRewardRequest, RegisterRewardResponse } from "@/feature/register-reward/register-reward.form";

/**
 * リワード登録APIの具体実装
 * @param { UID } uid
 * @param { RegisterRewardRequest } _request
 */
export const registerRewardHandler = async (
  uid: UID,
  _request: RegisterRewardRequest
): Promise<RegisterRewardResponse> => {
  // 現在のステータスを取得する
  const currentStatus = await getPickStatus({ uid });

  // 獲得リワードの登録が可能であるかチェックする
  const canEarn = checkCanEarnReward({ pickStatus: currentStatus });
  if (!canEarn) {
    throw new UnavailableEarnRewardError();
  }

  // 獲得リワードを登録する
  const earnedReward = createNewEarnedReward({ now: new Date() });
  await setEarnedReward({
    uid: uid,
    earnedReward: earnedReward,
  });

  // 返却
  return {};
};

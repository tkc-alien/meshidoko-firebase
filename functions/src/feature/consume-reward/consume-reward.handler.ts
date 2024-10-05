import { checkCanUseReward } from "@/domain/check-can-use-reward";
import { createUsedRewardByEarnedReward } from "@/domain/create-used-reward-by-earned-reward";
import { getPickStatus } from "@/domain/get-pick-status";
import { setEarnedReward } from "@/domain/set-earned-reward";
import { setUsedRewards } from "@/domain/set-used-rewards";
import { UID } from "@/entity/user";
import { IllegalStateError, UnavailableUseRewardError } from "@/error/app-errors";
import { ConsumeRewardRequest, ConsumeRewardResponse } from "@/feature/consume-reward/consume-reward.form";

/**
 * リワード使用APIの具体実装
 * @param { UID } uid
 * @param { ConsumeRewardRequest }  _request
 * @return { ConsumeRewardResponse }
 */
export const consumeRewardHandler = async (
  uid: UID,
  _request: ConsumeRewardRequest
): Promise<ConsumeRewardResponse> => {
  // 現在のステータスを取得する
  const currentStatus = await getPickStatus({ uid });

  // リワード使用が可能であるかチェックする
  const canUse = checkCanUseReward({ pickStatus: currentStatus });
  if (!canUse) {
    throw new UnavailableUseRewardError();
  }

  // 使用リワードを登録する
  const earnedReward = currentStatus?.earnedReward;
  if (earnedReward === undefined) {
    throw new IllegalStateError("獲得リワードがundefinedであるのにリワード使用が許可されています。");
  }
  const usedReward = createUsedRewardByEarnedReward({
    earnedReward: earnedReward,
    now: new Date(),
  });
  await setUsedRewards({
    uid: uid,
    usedRewards: [...(currentStatus?.usedRewards ?? []), usedReward],
  });

  // 獲得リワードをリセットする
  await setEarnedReward({ uid: uid, earnedReward: undefined });

  // 返却
  return {};
};

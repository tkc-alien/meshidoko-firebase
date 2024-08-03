import { checkCanPick } from "@/domain/check-can-pick";
import { clearRestaurantsCache } from "@/domain/clear-restaurants-cache";
import { getNextAvailableDate } from "@/domain/get-next-available-date";
import { getPickStatus } from "@/domain/get-pick-status";
import { getRemainginRewardCount } from "@/domain/get-remaining-reward-count";
import { getRestaurantCandidates } from "@/domain/get-restaurant-candidates";
import { pickRestaurant } from "@/domain/pick-restaurant";
import { setPickStatus } from "@/domain/set-pick-status";
import { storeRestaurantsCache } from "@/domain/store-restaurants-cache";
import { UID } from "@/entity/user";
import {
  IllegalStateError,
  NoRestarantsError,
  UnavailablePickError,
} from "@/error/app-errors";
import {
  PickRestaurantRequest,
  PickRestaurantResponse,
} from "@/feature/pick-restaurant/pick-restaurant.form";

/**
 * レストラン抽選APIの具体実装
 * @param { UID } uid
 * @param { PickRestaurantRequest } request
 */
export const pickRestaurantHandler = async (
  uid: UID,
  request: PickRestaurantRequest
): Promise<PickRestaurantResponse> => {
  // 抽選が可能であるかチェックする
  const currentStatus = await getPickStatus({ uid });
  const canPick = checkCanPick({ pickStatus: currentStatus, now: new Date() });
  if (!canPick) {
    if (currentStatus) {
      throw new UnavailablePickError(
        getNextAvailableDate({ pickStatus: currentStatus })
      );
    } else {
      throw new IllegalStateError(
        "抽選ステータスがundefinedであるのに抽選が拒否されています。"
      );
    }
  }

  // 前回のキャッシュが残っている場合は削除する
  if (currentStatus?.cacheId) {
    await clearRestaurantsCache({ cacheId: currentStatus.cacheId });
  }

  // レストラン情報を取得する
  const restaurantCandidates = await getRestaurantCandidates({
    location: request.location,
    distance: request.distance,
    alcohol: request.alcohol,
    prices: request.prices,
  });
  // レストランが１件も見つからない場合はエラーを投げる
  if (restaurantCandidates.length === 0) {
    throw new NoRestarantsError(request);
  }
  // キャッシュを保存する
  const cacheResult = await storeRestaurantsCache({
    restaurants: restaurantCandidates,
  });

  // レストランを抽選する
  const restaurant = pickRestaurant({ candidates: restaurantCandidates });

  // 抽選ステータスを更新する
  const newStatus = await setPickStatus({
    uid: uid,
    cacheId: cacheResult.cacheId,
    now: new Date(),
  });

  // 返却
  return {
    data: restaurant,
    nextAvailableAt: getNextAvailableDate({ pickStatus: newStatus }),
    rewardRemainingCount: getRemainginRewardCount({ pickStatus: newStatus }),
  };
};

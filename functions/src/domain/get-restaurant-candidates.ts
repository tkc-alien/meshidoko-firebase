import "ts-array-extensions";

import {
  Language,
  PlacesNearbyRanking,
} from "@googlemaps/google-maps-services-js";
import { distance } from "@turf/distance";
import { point } from "@turf/helpers";

import {
  AddressGeometry,
  PlaceData,
  placesNearby,
  PlacesNearbyRequest,
} from "@/data/places-nearby";
import {
  AlcoholCondition,
  DistanceCondition,
  PriceCondition,
} from "@/entity/condition";
import { Restaurant, RestaurantSchema } from "@/entity/restaurant";
import {
  FailedToFetchRestaurantsError,
  InvalidEnvironmentError,
} from "@/error/app-errors";
import { delay } from "@/util/async-utils";

type Input = {
  location: {
    latitude: number;
    longitude: number;
  };
  distance: DistanceCondition;
  alcohol?: AlcoholCondition;
  prices?: PriceCondition[];
};

type Output = Restaurant[];

/**
 * レストラン候補を取得する
 * @param { Input } input
 */
export async function getRestaurantCandidates(input: Input): Promise<Output> {
  // PlacesAPIキーを取得する
  const key = process.env.PLACES_API_KEY;
  // 環境変数チェック
  if (!key) {
    throw new InvalidEnvironmentError({ PLACES_API_KEY: key });
  }

  // 初回コール
  const request: PlacesNearbyRequest = {
    params: {
      key,
      location: [input.location.latitude, input.location.longitude],
      radius: input.distance,
      keyword: "飲食店",
      rankby: PlacesNearbyRanking.distance,
      language: Language.ja,
    },
  };
  const response = await placesNearby(request);
  // レスポンス解析
  if (response.data.status !== "OK") {
    throw new FailedToFetchRestaurantsError(
      response.data.status,
      response.data.error_message,
      request
    );
  }
  // 初回コールの結果をレストラン情報に変換して保持する
  let candidates: Restaurant[] = response.data.results.compactMap(
    (element, _i, _a) => convert(element, input.location)
  );

  // 次ページのトークン
  let pagetoken = response.data.next_page_token;
  // 最大10回まで次ページをリクエストする
  for (let count = 1; count < 10 && pagetoken; count++) {
    // PlacesAPIのページネーションはすぐに叩くと失敗するので少し待つ
    await delay(1200);
    // 次ページを取得
    const request: PlacesNearbyRequest = {
      params: {
        key,
        location: [input.location.latitude, input.location.longitude],
        pagetoken: pagetoken,
      },
    };
    const response = await placesNearby(request);
    // レスポンス解析
    if (response.data.status !== "OK") {
      throw new FailedToFetchRestaurantsError(
        response.data.status,
        response.data.error_message,
        request
      );
    }
    // 次ページの結果をレストラン情報に変換して保持する
    candidates = [
      ...candidates,
      ...response.data.results.compactMap((element, _i, _a) =>
        convert(element, input.location)
      ),
    ];
    // 次ページを更新
    pagetoken = response.data.next_page_token;
  }

  // 返却
  return candidates;
}

/**
 * PlaceAPIの情報をEntityに変換する
 * @param { PlaceData } placeData
 * @param { object } currentLocation
 * @return { Restaurant | undefined }
 */
function convert(
  placeData: Partial<PlaceData>,
  currentLocation: { latitude: number; longitude: number }
): Restaurant | undefined {
  const object: Partial<Restaurant> = {
    id: placeData.place_id,
    name: placeData.name,
    mapUrl: convertMapUrl(placeData.name),
    imageUrl: convertImageUrl(placeData.photos?.first()?.photo_reference),
    latitude: placeData.geometry?.location?.lat,
    longitude: placeData.geometry?.location?.lng,
    distance: convertDistance(currentLocation, placeData.geometry),
    priceMin: convertPrice(placeData.price_level)?.min,
    priceMax: convertPrice(placeData.price_level)?.max,
  };

  return RestaurantSchema.safeParse(object).data;
}

/**
 * PlaceAPIの情報から地図URLに変換する
 * @param { string } name
 * @return { string | undefined }
 */
function convertMapUrl(name?: string): string | undefined {
  if (name) {
    return `https://www.google.com/maps/search/?api=1&query=${name}`;
  } else {
    return undefined;
  }
}

/**
 * PlaceAPIの画像リファレンスから画像URLに変換する
 * @param { string? } photoReference
 * @return { string | undefined }
 */
function convertImageUrl(photoReference?: string): string | undefined {
  if (photoReference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}`;
  } else {
    return undefined;
  }
}

/**
 * PlaceAPIの位置情報から距離に変換する
 * @param { object } currentLocation
 * @param { AddressGeometry } geometry
 * @return { number | undefined }
 */
function convertDistance(
  currentLocation: { latitude: number; longitude: number },
  geometry?: AddressGeometry
): number | undefined {
  if (geometry) {
    return distance(
      point([geometry.location.lng, geometry.location.lat]),
      point([currentLocation.longitude, currentLocation.latitude]),
      { units: "meters" }
    );
  } else {
    return undefined;
  }
}

/**
 * PlaceAPIの価格情報から予算下限値・上限値に変換する
 * @param { number? } priceLevel
 * @return { object | undefined }
 */
function convertPrice(
  priceLevel?: number
): { min?: number; max?: number } | undefined {
  // TODO 値は仮置きなのでちゃんと確認する
  if (priceLevel !== undefined) {
    switch (priceLevel) {
      case 0:
        return undefined;
      case 1:
        return { min: undefined, max: 1000 };
      case 2:
        return { min: 1000, max: 2000 };
      case 3:
        return { min: 2000, max: 5000 };
      case 4:
        return { min: 5000, max: undefined };
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
}

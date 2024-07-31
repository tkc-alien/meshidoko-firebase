/**
 * @jest-environment jsdom
 */

import {
  Language,
  PlacesNearbyRanking,
  Status,
} from "@googlemaps/google-maps-services-js";

import * as placesNearby from "@/data/places-nearby";
import { getRestaurantCandidates } from "@/domain/get-restaurant-candidates";
import { AlcoholCondition, PriceCondition } from "@/entity/condition";
import {
  FailedToFetchRestaurantsError,
  InvalidEnvironmentError,
} from "@/error/app-errors";
import { baseRestaurant } from "@/util/spec-util";

const baseInput = {
  location: {
    latitude: 135.1,
    longitude: 35.1,
  },
  distance: 100,
  alcohol: "notRequired" as AlcoholCondition,
  prices: ["inexpensive" as PriceCondition],
};

const basePlace: placesNearby.Place = {
  place_id: "test-restaurant-id",
  name: "Test Restaurant",
  geometry: {
    location: { lat: 135.1, lng: 35.1 },
  },
  photos: [
    { photo_reference: "test-photo-reference-1" },
    { photo_reference: "test-photo-reference-2" },
    { photo_reference: "test-photo-reference-3" },
  ],
  price_level: 0,
};

const timeout = 20000;

const sut = getRestaurantCandidates;

describe(sut.name, () => {
  beforeEach(() => {
    process.env.PLACES_API_KEY = "test-places-api-key";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // 正常系 ------------------------------------------------------------

  test(
    "成功: 正常なデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace, // condition
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant]);
    },
    timeout
  );

  // レスポンスパラメータパターン ----------------------------------------------

  test(
    "エラー FailedToFetchRestaurantsError: data.statusがOKでないデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.INVALID_REQUEST, // condition
          error_message: "",
          next_page_token: undefined,
          results: [basePlace],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      // Verify
      expect(sut(input)).rejects.toThrow(FailedToFetchRestaurantsError);
    },
    timeout
  );

  test(
    "成功: data.resultsが空のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [], // condition
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): place_idが空文字のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              place_id: "", // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): place_idがNULLのデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              place_id: undefined, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): nameが空文字のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              name: "", // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): nameがNULLのデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              name: undefined, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant]);
    },
    timeout
  );

  test(
    "成功(該当データを含む): photosが空のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              photos: [], // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        baseRestaurant,
        { ...baseRestaurant, imageUrl: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功(該当データを含む): photosがNULLのデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              photos: undefined, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        baseRestaurant,
        { ...baseRestaurant, imageUrl: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功(該当データを含む): photos.photo_referenceが空文字のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              photos: [
                { photo_reference: "" }, // condition
              ],
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        baseRestaurant,
        { ...baseRestaurant, imageUrl: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): geometryがNULLのデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              geometry: undefined, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant]);
    },
    timeout
  );

  test(
    "成功(該当データを含む): price_levelがNULLのデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              price_level: undefined, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        baseRestaurant,
        { ...baseRestaurant, priceMin: undefined, priceMax: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功: price_levelが0のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            {
              ...basePlace,
              price_level: 0, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant, priceMin: undefined, priceMax: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功: price_levelが1のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            {
              ...basePlace,
              price_level: 1, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant, priceMin: undefined, priceMax: 1000 },
      ]);
    },
    timeout
  );

  test(
    "成功: price_levelが2のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            {
              ...basePlace,
              price_level: 2, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant, priceMin: 1000, priceMax: 2000 },
      ]);
    },
    timeout
  );

  test(
    "成功: price_levelが3のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            {
              ...basePlace,
              price_level: 3, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant, priceMin: 2000, priceMax: 5000 },
      ]);
    },
    timeout
  );

  test(
    "成功: price_levelが4のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            {
              ...basePlace,
              price_level: 4, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant, priceMin: 5000, priceMax: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功: price_levelが5のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            {
              ...basePlace,
              price_level: 5, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant, priceMin: undefined, priceMax: undefined },
      ]);
    },
    timeout
  );

  test(
    "成功(該当データを含む): price_levelが負のデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            basePlace,
            {
              ...basePlace,
              price_level: -1, // condition
            },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        baseRestaurant,
        { ...baseRestaurant, priceMin: undefined, priceMax: undefined },
      ]);
    },
    timeout
  );

  // リストパターン ----------------------------------------------------------

  test(
    "成功: 複数の正常なデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            { ...basePlace },
            { ...basePlace, place_id: "test-restaurant-id-2" },
            { ...basePlace, place_id: "test-restaurant-id-3" },
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant },
        { ...baseRestaurant, id: "test-restaurant-id-2" },
        { ...baseRestaurant, id: "test-restaurant-id-3" },
      ]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): 一部が正常でないデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            { ...basePlace },
            { ...basePlace, place_id: "test-restaurant-id-2" },
            { ...basePlace, place_id: undefined }, // condition
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([
        { ...baseRestaurant },
        { ...baseRestaurant, id: "test-restaurant-id-2" },
      ]);
    },
    timeout
  );

  test(
    "成功(該当データを含まない): 複数の正常でないデータが取得できたとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [
            { ...basePlace, place_id: undefined }, // condition
            { ...basePlace, place_id: undefined }, // condition
            { ...basePlace, place_id: undefined }, // condition
          ],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([]);
    },
    timeout
  );

  // ページネーションパターン --------------------------------------------------

  test(
    "1回取得: ページネーションがないとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined, // condition
          results: [basePlace],
        },
      };
      const placesNearbySpy = jest
        .spyOn(placesNearby, "placesNearby")
        .mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      await sut(input);
      // Verify
      expect(placesNearbySpy).toHaveBeenCalledTimes(1);
      expect(placesNearbySpy).toHaveBeenNthCalledWith(1, {
        params: {
          key: "test-places-api-key",
          location: [135.1, 35.1],
          radius: 100,
          keyword: "飲食店",
          rankby: PlacesNearbyRanking.distance,
          language: Language.ja,
        },
      });
    },
    timeout
  );

  test(
    "2回取得: ページネーションが１度だけあるとき",
    async () => {
      // Setup
      const placesNearbySpy = jest
        .spyOn(placesNearby, "placesNearby")
        .mockResolvedValueOnce({
          status: 200,
          data: {
            status: Status.OK,
            error_message: "",
            next_page_token: "test-page-token", // condition
            results: [basePlace],
          },
        })
        .mockResolvedValueOnce({
          status: 200,
          data: {
            status: Status.OK,
            error_message: "",
            next_page_token: undefined,
            results: [basePlace],
          },
        });
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output).toEqual([baseRestaurant, baseRestaurant]);
      expect(placesNearbySpy).toHaveBeenCalledTimes(2);
      expect(placesNearbySpy).toHaveBeenNthCalledWith(1, {
        params: {
          key: "test-places-api-key",
          location: [135.1, 35.1],
          radius: 100,
          keyword: "飲食店",
          rankby: PlacesNearbyRanking.distance,
          language: Language.ja,
        },
      });
      expect(placesNearbySpy).toHaveBeenNthCalledWith(2, {
        params: {
          key: "test-places-api-key",
          location: [135.1, 35.1],
          pagetoken: "test-page-token",
        },
      });
    },
    timeout
  );

  test(
    "10回取得: ページネーションが無限にあるとき",
    async () => {
      // Setup
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: "test-page-token", // condition
          results: [basePlace],
        },
      };
      const placesNearbySpy = jest
        .spyOn(placesNearby, "placesNearby")
        .mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      const output = await sut(input);
      // Verify
      expect(output.length).toBe(10);
      expect(placesNearbySpy).toHaveBeenCalledTimes(10);
      expect(placesNearbySpy).toHaveBeenNthCalledWith(1, {
        params: {
          key: "test-places-api-key",
          location: [135.1, 35.1],
          radius: 100,
          keyword: "飲食店",
          rankby: PlacesNearbyRanking.distance,
          language: Language.ja,
        },
      });
      expect(placesNearbySpy).toHaveBeenNthCalledWith(2, {
        params: {
          key: "test-places-api-key",
          location: [135.1, 35.1],
          pagetoken: "test-page-token",
        },
      });
      expect(placesNearbySpy).toHaveBeenNthCalledWith(10, {
        params: {
          key: "test-places-api-key",
          location: [135.1, 35.1],
          pagetoken: "test-page-token",
        },
      });
    },
    timeout
  );

  test(
    "エラー FailedToFetchRestaurantsError: ページネーション取得時のdata.statusがOKでないとき",
    async () => {
      // Setup
      jest
        .spyOn(placesNearby, "placesNearby")
        .mockResolvedValueOnce({
          status: 200,
          data: {
            status: Status.OK, // condition
            error_message: "",
            next_page_token: "test-page-token",
            results: [basePlace],
          },
        })
        .mockResolvedValueOnce({
          status: 200,
          data: {
            status: Status.INVALID_REQUEST, // condition
            error_message: "",
            next_page_token: undefined,
            results: [basePlace],
          },
        });
      // Exercise
      const input = { ...baseInput };
      // Verify
      expect(sut(input)).rejects.toThrow(FailedToFetchRestaurantsError);
    },
    timeout
  );

  // 環境変数パターン --------------------------------------------------------

  test(
    "エラー InvalidEnvironmentError: env.PLACES_API_KEYが空文字のとき",
    async () => {
      // Setup
      process.env.PLACES_API_KEY = ""; // condition
      const mockResponse: placesNearby.PlacesNearbyResponse = {
        status: 200,
        data: {
          status: Status.OK,
          error_message: "",
          next_page_token: undefined,
          results: [basePlace],
        },
      };
      jest.spyOn(placesNearby, "placesNearby").mockResolvedValue(mockResponse);
      // Exercise
      const input = { ...baseInput };
      // Verify
      expect(sut(input)).rejects.toThrow(InvalidEnvironmentError);
    },
    timeout
  );
});

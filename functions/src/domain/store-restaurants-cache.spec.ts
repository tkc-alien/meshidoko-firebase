import { storage } from "firebase-admin";

import { storeRestaurantsCache } from "@/domain/store-restaurants-cache";
import { InvalidArgumentError } from "@/error/app-errors";
import { baseRestaurant, setup, teardown } from "@/util/spec-util";

const sut = storeRestaurantsCache;

describe(sut.name, () => {
  beforeAll(async () => {
    await setup();
  });

  beforeEach(async () => {
    await storage().bucket().deleteFiles();
  });

  afterAll(async () => {
    await teardown();
  });

  test("成功: retaurantsの要素が1つのとき", async () => {
    // Exercise
    const input = {
      restaurants: [baseRestaurant], // condition
    };
    const output = await sut(input);
    // Verify
    expect(output.cacheId.length).toEqual(26);
    const file = storage().bucket().file(`caches/${output.cacheId}.json`);
    expect(file.exists()).resolves.toEqual([true]);
    const data = await file.download();
    expect(data.toString()).toEqual(
      `[
  {
    "id": "test-restaurant-id",
    "name": "Test Restaurant",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Test Restaurant",
    "imageUrl": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=test-photo-reference-1",
    "latitude": 135.1,
    "longitude": 35.1,
    "distance": 0
  }
]`
    );
  });

  test("成功: restaurantsの要素が複数とき", async () => {
    // Exercise
    const input = {
      restaurants: [
        { ...baseRestaurant, id: "test-restaurant-1" }, // condition
        { ...baseRestaurant, id: "test-restaurant-2" }, // condition
      ],
    };
    const output = await sut(input);
    // Verify
    expect(output.cacheId.length).toEqual(26);
    const file = storage().bucket().file(`caches/${output.cacheId}.json`);
    expect(file.exists()).resolves.toEqual([true]);
    const data = await file.download();
    expect(data.toString()).toEqual(
      `[
  {
    "id": "test-restaurant-1",
    "name": "Test Restaurant",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Test Restaurant",
    "imageUrl": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=test-photo-reference-1",
    "latitude": 135.1,
    "longitude": 35.1,
    "distance": 0
  },
  {
    "id": "test-restaurant-2",
    "name": "Test Restaurant",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Test Restaurant",
    "imageUrl": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=test-photo-reference-1",
    "latitude": 135.1,
    "longitude": 35.1,
    "distance": 0
  }
]`
    );
  });

  test("エラー InvalidArgumentError: retaurantsが空のとき", async () => {
    // Exercise
    const input = {
      restaurants: [], // condition
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
  });
});

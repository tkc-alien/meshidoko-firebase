import { storage } from "firebase-admin";

import { retrieveRestaurantsCache } from "@/domain/retrieve-restaurants-cache";
import { InvalidArgumentError } from "@/error/app-errors";
import { baseRestaurant, setup, teardown } from "@/util/spec-util";

const sut = retrieveRestaurantsCache;

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

  test("成功: 正しいファイルが存在するとき", async () => {
    // Setup
    await storage().bucket().file("caches/test-cache-id.json").save(`[
  {
    "id": "test-restaurant-id",
    "name": "Test Restaurant",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Test Restaurant",
    "imageUrl": "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=test-photo-reference-1",
    "latitude": 135.1,
    "longitude": 35.1,
    "distance": 0
  }
]`);
    // Exercise
    const input = {
      cacheId: "test-cache-id",
    };
    const output = await sut(input);
    // Verify
    expect(output).toEqual({
      restaurants: [baseRestaurant],
    });
  });

  test("UNDEFINED: 不正なファイルが存在するとき（スキーマ解決不可）", async () => {
    // Setup
    await storage().bucket().file("caches/test-cache-id.json").save(`[
  {
    "id": "test-restaurant-id",
    "key": "invalid"
  }
]`);
    // Exercise
    const input = {
      cacheId: "test-cache-id",
    };
    const output = await sut(input);
    // Verify
    expect(output).toEqual({});
  });

  test("UNDEFINED: 不正なファイルが存在するとき（JSON解決不可）", async () => {
    // Setup
    await storage().bucket().file("caches/test-cache-id.json").save("{abc!");
    // Exercise
    const input = {
      cacheId: "test-cache-id",
    };
    const output = await sut(input);
    // Verify
    expect(output).toEqual({});
  });

  test("UNDEFINED: 対象のファイルが存在しないとき", async () => {
    // Exercise
    const input = {
      cacheId: "test-cache-id",
    };
    const output = await sut(input);
    // Verify
    expect(output).toEqual({});
  });

  test("エラー InvalidArgumentError: cacheIdが空文字のとき", async () => {
    // Exercise
    const input = {
      cacheId: "", // condition
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
  });
});

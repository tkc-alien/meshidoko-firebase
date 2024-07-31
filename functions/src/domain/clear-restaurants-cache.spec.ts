import { storage } from "firebase-admin";

import { clearRestaurantsCache } from "@/domain/clear-restaurants-cache";
import { InvalidArgumentError } from "@/error/app-errors";
import { setup, teardown } from "@/util/spec-util";

const sut = clearRestaurantsCache;

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

  test("成功: キャッシュIDが正常, 対象のファイルが存在するとき", async () => {
    // Setup
    await storage().bucket().file("caches/test_cache_1.json").save("TEST");
    await storage().bucket().file("caches/test_cache_2.json").save("TEST");
    await storage().bucket().file("caches/test_cache_3.json").save("TEST");
    // Exercise
    const input = {
      cacheId: "test_cache_1", // condition
    };
    await sut(input);
    // Verify
    expect(
      await storage().bucket().file("caches/test_cache_1.json").exists()
    ).toEqual([false]);
  });

  test("成功: キャッシュIDが正常, 対象のファイルが存在しないとき", async () => {
    // Setup
    await storage().bucket().file("caches/test_cache_1.json").save("TEST");
    await storage().bucket().file("caches/test_cache_2.json").save("TEST");
    await storage().bucket().file("caches/test_cache_3.json").save("TEST");
    // Exercise
    const input = {
      cacheId: "test_cache_4", // condition
    };
    await sut(input);
    // Verify
    expect(
      await storage().bucket().file("caches/test_cache_4.json").exists()
    ).toEqual([false]);
  });

  test("成功: キャッシュIDが正常, ファイルがひとつも存在しないとき", async () => {
    // Exercise
    const input = {
      cacheId: "test_cache_4", // condition
    };
    await sut(input);
    // Verify
    expect(
      await storage().bucket().file("caches/test_cache_4.json").exists()
    ).toEqual([false]);
  });

  test("エラー InvalidArgumentError: キャッシュIDが空文字のとき", async () => {
    // Setup
    await storage().bucket().file("caches/test_cache_1.json").save("TEST");
    await storage().bucket().file("caches/test_cache_2.json").save("TEST");
    await storage().bucket().file("caches/test_cache_3.json").save("TEST");
    // Exercise
    const input = {
      cacheId: "", // condition
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
  });
});

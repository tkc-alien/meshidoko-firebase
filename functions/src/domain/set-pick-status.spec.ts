import { database } from "firebase-admin";

import { setPickStatus } from "@/domain/set-pick-status";
import { InvalidArgumentError } from "@/error/app-errors";
import { setup, teardown } from "@/util/spec-util";

const sut = setPickStatus;

describe(sut.name, () => {
  beforeAll(async () => {
    await setup();
  });

  beforeEach(async () => {
    await database().ref().remove();
  });

  afterAll(async () => {
    await teardown();
  });

  test("成功: 既存データがないとき", async () => {
    // Exercise
    const input = {
      uid: "test-uid",
      cacheId: "test-cache-id",
      now: new Date("2000-01-01T03:00:00Z"),
    };
    const output = await sut(input);
    // Verify
    const snapshot = await database().ref("users/test-uid/pickStatus").get();
    expect(snapshot.exists()).toEqual(true);
    expect(snapshot.val()).toEqual({
      cacheId: "test-cache-id",
      pickedAt: "2000-01-01T03:00:00.000Z",
    });
    expect(output).toEqual({
      cacheId: "test-cache-id",
      pickedAt: new Date("2000-01-01T03:00:00Z"),
      earnedReward: undefined,
      usedRewards: undefined,
    });
  });

  test("成功: 既存データがあるとき", async () => {
    // Setup
    await database().ref("users/test-uid/pickStatus").set({
      key: "value",
    });
    // Exercise
    const input = {
      uid: "test-uid",
      cacheId: "test-cache-id",
      now: new Date("2000-01-01T03:00:00Z"),
    };
    const output = await sut(input);
    // Verify
    const snapshot = await database().ref("users/test-uid/pickStatus").get();
    expect(snapshot.exists()).toEqual(true);
    expect(snapshot.val()).toEqual({
      cacheId: "test-cache-id",
      pickedAt: "2000-01-01T03:00:00.000Z",
    });
    expect(output).toEqual({
      cacheId: "test-cache-id",
      pickedAt: new Date("2000-01-01T03:00:00Z"),
      earnedReward: undefined,
      usedRewards: undefined,
    });
  });

  test("エラー InvalidArgumentError: uidが乾文字のとき", async () => {
    // Exercise
    const input = {
      uid: "", // condition
      cacheId: "test-cache-id",
      now: new Date("2000-01-01T03:00:00Z"),
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
    const snapshot = await database().ref("users/pickStatus").get();
    expect(snapshot.exists()).toEqual(false);
  });

  test("エラー InvalidArgumentError: cacheIdが乾文字のとき", async () => {
    // Exercise
    const input = {
      uid: "test-uid",
      cacheId: "", // condition
      now: new Date("2000-01-01T03:00:00Z"),
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
    const snapshot = await database().ref("users/pickStatus").get();
    expect(snapshot.exists()).toEqual(false);
  });
});

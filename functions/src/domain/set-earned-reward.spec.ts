import { database } from "firebase-admin";

import { setEarnedReward } from "@/domain/set-earned-reward";
import { InvalidArgumentError } from "@/error/app-errors";
import { baseEarnedReward, setup, teardown } from "@/util/spec-util";

const sut = setEarnedReward;

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
      earnedReward: baseEarnedReward,
    };
    await sut(input);
    // Verify
    const snapshot = await database().ref("users/test-uid/pickStatus/earnedReward").get();
    expect(snapshot.exists()).toEqual(true);
    expect(snapshot.val()).toEqual({
      rewardId: "test-reward-id",
      earnedAt: "2000-01-01T03:00:00.000Z",
    });
  });

  test("成功: 既存データがあるとき", async () => {
    // Setup
    await database().ref("users/test-uid/pickStatus/earnedReward").set({
      key: "value",
    });
    // Exercise
    const input = {
      uid: "test-uid",
      earnedReward: baseEarnedReward,
    };
    await sut(input);
    // Verify
    const snapshot = await database().ref("users/test-uid/pickStatus/earnedReward").get();
    expect(snapshot.exists()).toEqual(true);
    expect(snapshot.val()).toEqual({
      rewardId: "test-reward-id",
      earnedAt: "2000-01-01T03:00:00.000Z",
    });
  });

  test("エラー InvalidArgumentError: uidが空文字のとき", async () => {
    // Exercise
    const input = {
      uid: "", // condition
      earnedReward: baseEarnedReward,
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
    const snapshot = await database().ref("users/pickStatus/earnedReward").get();
    expect(snapshot.exists()).toEqual(false);
  });

  test("エラー InvalidArgumentError: earnedReward.rewardIdが空文字のとき", async () => {
    // Exercise
    const input = {
      uid: "test-uid",
      earnedReward: {
        ...baseEarnedReward,
        rewardId: "", // condition
      },
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
    const snapshot = await database().ref("users/pickStatus/earnedReward").get();
    expect(snapshot.exists()).toEqual(false);
  });
});

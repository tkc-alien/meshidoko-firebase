import { database } from "firebase-admin";
import { Reference } from "firebase-admin/database";

import { setUsedRewards } from "@/domain/set-used-rewards";
import { InvalidArgumentError } from "@/error/app-errors";
import { baseUsedReward, setup, teardown } from "@/util/spec-util";

const sut = setUsedRewards;

describe(sut.name, () => {
  /** テストデータを格納するリファレンス */
  let sutRef!: Reference;

  beforeAll(async () => {
    await setup();
    sutRef = database().ref("users/test-uid/pickStatus/usedRewards");
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
      usedRewards: [baseUsedReward],
    };
    await sut(input);
    // Verify
    const snapshot = await sutRef.get();
    expect(snapshot.exists()).toEqual(true);
    expect(snapshot.val()).toEqual([
      {
        rewardId: "test-reward-id",
        usedAt: "2000-01-01T03:00:00.000Z",
      },
    ]);
  });

  test("成功: 既存データがあるとき", async () => {
    // Setup
    await sutRef.set({ key: "value" });
    // Exercise
    const input = {
      uid: "test-uid",
      usedRewards: [baseUsedReward],
    };
    await sut(input);
    // Verify
    const snapshot = await sutRef.get();
    expect(snapshot.exists()).toEqual(true);
    expect(snapshot.val()).toEqual([
      {
        rewardId: "test-reward-id",
        usedAt: "2000-01-01T03:00:00.000Z",
      },
    ]);
  });

  test("成功: usedRewardsがundefinedのとき", async () => {
    // Setup
    await sutRef.set({ key: "value" });
    // Exercise
    const input = {
      uid: "test-uid",
      usedRewards: undefined, // condition
    };
    await sut(input);
    // Verify
    const snapshot = await sutRef.get();
    expect(snapshot.exists()).toEqual(false);
    expect(snapshot.val()).toBeNull();
  });

  test("エラー InvalidArgumentError: uidが空文字のとき", async () => {
    // Exercise
    const input = {
      uid: "", // condition
      usedRewards: [baseUsedReward],
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
    const snapshot = await sutRef.get();
    expect(snapshot.exists()).toEqual(false);
  });

  test("エラー InvalidArgumentError: usedReward.rewardIdが空文字のとき", async () => {
    // Exercise
    const input = {
      uid: "test-uid",
      usedRewards: [
        {
          ...baseUsedReward,
          rewardId: "", // condition
        },
      ],
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
    const snapshot = await sutRef.get();
    expect(snapshot.exists()).toEqual(false);
  });
});

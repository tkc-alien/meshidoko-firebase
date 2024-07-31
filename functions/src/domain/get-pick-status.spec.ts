import { database } from "firebase-admin";

import { getPickStatus } from "@/domain/get-pick-status";
import { PickStatus } from "@/entity/pick-status";
import { InvalidArgumentError } from "@/error/app-errors";
import {
  basePickStatus,
  basePickStatusData,
  setup,
  teardown,
} from "@/util/spec-util";

const sut = getPickStatus;

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

  test("成功: 正常なデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = {
      ...basePickStatus,
    };
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: cacheIdが空文字のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      cacheId: "", // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: cacheIdがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      cacheId: null, // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: pickedAtが空文字のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      pickedAt: "", // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: pickedAtがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      pickedAt: null, // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: pickedAtが日時に解決できないデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      pickedAt: "not convertible", // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("成功: earnedRewardがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      earnedReward: null,
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = {
      ...basePickStatus,
      earnedReward: undefined,
    };
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: earnedReward.rewardIdが空文字のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      earnedReward: {
        ...basePickStatusData.earnedReward,
        rewardId: "", // condition
      },
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: earnedReward.rewardIdがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      earnedReward: {
        ...basePickStatusData.earnedReward,
        rewardId: null, // condition
      },
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: earnedReward.earnedAtが空文字のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      earnedReward: {
        ...basePickStatusData.earnedReward,
        earnedAt: "", // condition
      },
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: earnedReward.earnedAtがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      earnedReward: {
        ...basePickStatusData.earnedReward,
        earnedAt: null, // condition
      },
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: earnedReward.earnedAtが日時に解決できないデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      earnedReward: {
        ...basePickStatusData.earnedReward,
        earnedAt: "not convertible", // condition
      },
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("成功: usedRewardsが空のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: [], // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = {
      ...basePickStatus,
      usedRewards: undefined,
    };
    expect(output).toEqual(exp);
  });

  test("成功: usedRewardsがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: null, // condition
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = {
      ...basePickStatus,
      usedRewards: undefined,
    };
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: usedRewards.rewardIdが空文字のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: [
        {
          ...basePickStatusData.usedRewards[0],
          rewardId: "", // condition
        },
      ],
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: usedRewards.rewardIdがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: [
        {
          ...basePickStatusData.usedRewards[0],
          rewardId: null, // condition
        },
      ],
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: usedRewards.usedAtが空文字のデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: [
        {
          ...basePickStatusData.usedRewards[0],
          usedAt: "", // condition
        },
      ],
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: usedRewards.usedAtがNULLのデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: [
        {
          ...basePickStatusData.usedRewards[0],
          usedAt: null, // condition
        },
      ],
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: usedRewards.usedAtが日時に解決できないデータが存在するとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
      usedRewards: [
        {
          ...basePickStatusData.usedRewards[0],
          usedAt: "not convertible", // condition
        },
      ],
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = { uid: "test-user" };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: 対象のデータが存在しない", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = {
      uid: "not-exist-test-user", // condition
    };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("UNDEFINED: データがひとつも存在しない", async () => {
    // Setup
    // condition
    // Exercise
    const input = {
      uid: "not-exist-test-user",
    };
    const output = await sut(input);
    // Verify
    const exp: PickStatus | undefined = undefined;
    expect(output).toEqual(exp);
  });

  test("エラー InvalidArgumentError: uidが空文字のとき", async () => {
    // Setup
    const data = {
      ...basePickStatusData,
    };
    await database().ref("users/test-user/pickStatus").set(data);
    // Exercise
    const input = {
      uid: "", // condition
    };
    // Verify
    expect(sut(input)).rejects.toThrow(InvalidArgumentError);
  });
});

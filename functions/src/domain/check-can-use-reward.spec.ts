import { maxRewardCount } from "@/const";
import { checkCanUseReward } from "@/domain/check-can-use-reward";
import { basePickStatus, baseUsedReward } from "@/util/spec-util";

const sut = checkCanUseReward;

describe(sut.name, () => {
  test("拒否: 抽選ステータスがNULLのとき", () => {
    // Exercise
    const input = {
      pickStatus: undefined, // condition
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(false);
  });

  test("拒否: 獲得リワードが存在しないとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        earnedReward: undefined, // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(false);
  });

  test("拒否: 使用リワード数が最大数より多いとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: Array(maxRewardCount + 1).fill(baseUsedReward), // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(false);
  });

  test("拒否: 使用リワード数が最大数と等しいとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: Array(maxRewardCount).fill(baseUsedReward), // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(false);
  });

  test("許可: 使用リワード数が最大数より少ないとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: Array(maxRewardCount - 1).fill(baseUsedReward), // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(true);
  });

  test("許可: 使用リワードが存在しない時", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: undefined, // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(true);
  });
});

import { getRemainginRewardCount } from "@/domain/get-remaining-reward-count";
import { basePickStatus, baseUsedReward } from "@/util/spec-util";

const sut = getRemainginRewardCount;

describe(sut.name, () => {
  test("4回: 使用リワードの要素が0個のとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: [], // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(4);
  });

  test("0回: 使用リワードの要素が4個のとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: [
          baseUsedReward,
          baseUsedReward,
          baseUsedReward,
          baseUsedReward, // condition
        ],
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(0);
  });

  test("0回: 使用リワードの要素が4個より多いとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: [
          baseUsedReward,
          baseUsedReward,
          baseUsedReward,
          baseUsedReward,
          baseUsedReward, // condition
        ],
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(0);
  });

  test("4回: 使用リワードがNULLのとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        usedRewards: undefined, // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(4);
  });
});

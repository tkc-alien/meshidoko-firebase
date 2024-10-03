import { checkCanEarnReward } from "@/domain/check-can-earn-reward";
import { baseEarnedReward, basePickStatus } from "@/util/spec-util";

const sut = checkCanEarnReward;

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

  test("拒否: 獲得リワードが存在するとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        earnedReward: baseEarnedReward, // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(false);
  });

  test("許可: 獲得リワードが存在しない", () => {
    // Exercise
    const input = {
      pickStatus: {
        ...basePickStatus,
        earnedReward: undefined, // condition
      },
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(true);
  });
});

import { createUsedRewardByEarnedReward } from "@/domain/create-used-reward-by-earned-reward";

const sut = createUsedRewardByEarnedReward;

describe(sut.name, () => {
  /** テスト用の日時 */
  const now = new Date("2000-01-01T00:00:00Z");

  test("成功", () => {
    // Exercise
    const input = {
      earnedReward: {
        rewardId: "TEST-ULID",
        earnedAt: new Date("2000-02-01T00:00:00Z"),
      },
      now: now,
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual({
      rewardId: "TEST-ULID",
      usedAt: now,
    });
  });
});

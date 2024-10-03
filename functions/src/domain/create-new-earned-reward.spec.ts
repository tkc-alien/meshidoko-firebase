import * as ulidx from "ulidx";

import { createNewEarnedReward } from "@/domain/create-new-earned-reward";

const sut = createNewEarnedReward;

describe(sut.name, () => {
  /** テスト用のULID */
  const testUlid = "TEST-ULID";
  /** テスト用の日時 */
  const now = new Date("2000-01-01T00:00:00Z");

  test("成功", () => {
    // Setup
    jest.spyOn(ulidx, "ulid").mockReturnValueOnce(testUlid);
    // Exercise
    const input = {
      now: now,
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual({
      rewardId: "TEST-ULID",
      earnedAt: now,
    });
  });
});

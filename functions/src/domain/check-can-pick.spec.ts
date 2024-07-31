import { checkCanPick } from "@/domain/check-can-pick";

const sut = checkCanPick;

describe(sut.name, () => {
  /** テスト用の日時 */
  const now = new Date("2000-01-01T00:00:00Z");

  test("許可: 抽選ステータスがNULLのとき", () => {
    // Exercise
    const input = {
      pickStatus: undefined, // condition
      now: now,
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(true);
  });

  test("許可: 抽選日時が6時間前より前のとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        cacheId: "test_cache_id",
        pickedAt: new Date("1999-12-31T17:59:59Z"), // condition
      },
      now: now,
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(true);
  });

  test("許可: 抽選日時が6時間前と等しいとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        cacheId: "test_cache_id",
        pickedAt: new Date("1999-12-31T18:00:00Z"), // condition
      },
      now: now,
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(true);
  });

  test("拒否: 抽選日時が6時間前より後のとき", () => {
    // Exercise
    const input = {
      pickStatus: {
        cacheId: "test_cache_id",
        pickedAt: new Date("1999-12-31T18:00:01Z"), // condition
      },
      now: now,
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual(false);
  });
});

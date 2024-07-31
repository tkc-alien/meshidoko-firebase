import { getNextAvailableDate } from "@/domain/get-next-available-date";

const sut = getNextAvailableDate;

describe(sut.name, () => {
  test("抽選日時の6時間後の日時: 常に", () => {
    const input = {
      pickStatus: {
        cacheId: "test-cache-id",
        pickedAt: new Date("2000-01-01T00:00:00Z"),
      },
    };
    const output = sut(input);

    expect(output).toEqual(new Date("2000-01-01T06:00:00Z"));
  });
});

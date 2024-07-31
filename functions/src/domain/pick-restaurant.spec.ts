import { pickRestaurant } from "@/domain/pick-restaurant";
import { InvalidArgumentError } from "@/error/app-errors";
import { baseRestaurant } from "@/util/spec-util";

const sut = pickRestaurant;

describe(sut.name, () => {
  test("成功: candidatesの要素が1つのとき", () => {
    // Exercise
    const input = {
      candidates: [{ ...baseRestaurant, id: "test-restaurant-1" }],
    };
    const output = sut(input);
    // Verify
    expect(output).toEqual({ ...baseRestaurant, id: "test-restaurant-1" });
  });

  test("成功: candidatesの要素が複数のとき", () => {
    // Exercise
    const input = {
      candidates: [
        { ...baseRestaurant, id: "test-restaurant-1" },
        { ...baseRestaurant, id: "test-restaurant-2" },
        { ...baseRestaurant, id: "test-restaurant-3" },
      ],
    };
    const output = sut(input);
    // Verify
    const isContained =
      output?.id === "test-restaurant-1" ||
      output?.id === "test-restaurant-2" ||
      output?.id === "test-restaurant-3";
    expect(isContained).toEqual(true);
  });

  test("エラー InvalidArgumentError: candidatesが空のとき", () => {
    // Exercise
    const input = {
      candidates: [],
    };
    // Verify
    expect(() => sut(input)).toThrow(InvalidArgumentError);
  });
});

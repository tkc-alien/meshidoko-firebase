import { Restaurant } from "@/entity/restaurant";
import { InvalidArgumentError } from "@/error/app-errors";

type Input = {
  candidates: Restaurant[];
};

type Output = Restaurant;

/**
 * レストランを抽選する
 * @param { Input } input
 * @return { Output }
 */
export function pickRestaurant(input: Input): Output {
  // 入力値チェック
  if (input.candidates.length === 0) {
    throw new InvalidArgumentError(input);
  }
  // 抽選
  const rand = Math.random();
  const index = Math.floor(rand * input.candidates.length);
  return input.candidates[index];
}

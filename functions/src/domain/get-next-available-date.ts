import { addMinutes } from "date-fns";

import { pickIntervalMinute } from "@/const";
import { PickStatus } from "@/entity/pick-status";

type Input = {
  pickStatus: PickStatus;
};

type Output = Date;

/**
 * 次回抽選可能日時を取得する
 * @param { Input } input
 * @return { Output }
 */
export function getNextAvailableDate(input: Input): Output {
  // 現在日時にインターバル分を追加する
  return addMinutes(input.pickStatus.pickedAt, pickIntervalMinute);
}

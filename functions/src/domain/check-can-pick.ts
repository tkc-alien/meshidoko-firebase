import { differenceInMinutes } from "date-fns";

import { pickIntervalMinute } from "@/const";
import { PickStatus } from "@/entity/pick-status";

type Input = {
  pickStatus?: PickStatus;
  now: Date;
};

type Output = boolean;

/**
 * 抽選が可能であるか判定する
 * @param { Input } input
 * @return { Output }
 */
export function checkCanPick(input: Input): Output {
  // 前回の抽選がない場合は常に許可する
  if (!input.pickStatus) {
    return true;
  }
  // 前回の抽選からインターバル分経過しているかチェックする
  const diff = differenceInMinutes(input.now, input.pickStatus.pickedAt);
  return diff >= pickIntervalMinute;
}

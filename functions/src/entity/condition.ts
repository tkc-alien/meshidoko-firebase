import { z } from "zod";

/** 距離条件 */
export type DistanceCondition = z.infer<typeof DistanceConditionSchema>;
export const DistanceConditionSchema = z.number().min(100).max(10000);

/** アルコール提供条件 */
export type AlcoholCondition = z.infer<typeof AlcoholConditionSchema>;
export const AlcoholConditionSchema = z.enum(["notRequired", "required"]);

/** 価格帯条件 */
export type PriceCondition = z.infer<typeof PriceConditionSchema>;
export const PriceConditionSchema = z.enum([
  "inexpensive",
  "moderate",
  "expensive",
  "veryExpensive",
]);

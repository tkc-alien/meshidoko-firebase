import { z } from "zod";

import {
  AlcoholConditionSchema,
  DistanceConditionSchema,
  PriceConditionSchema,
} from "@/entity/condition";
import { RestaurantSchema } from "@/entity/restaurant";

export type PickRestaurantRequest = z.infer<typeof PickRestaurantRequestSchema>;
export const PickRestaurantRequestSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  distance: DistanceConditionSchema,
  alcohol: AlcoholConditionSchema.optional(),
  prices: z.array(PriceConditionSchema).optional(),
});

export type PickRestaurantResponse = z.infer<
  typeof PickRestaurantResponseSchema
>;
export const PickRestaurantResponseSchema = z.object({
  data: RestaurantSchema,
  nextAvailableAt: z.date(),
  rewardRemainingCount: z.number(),
});

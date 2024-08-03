import { z } from "zod";

import {
  AlcoholConditionSchema,
  DistanceConditionSchema,
  PriceConditionSchema,
} from "@/entity/condition";
import { RestaurantSchema } from "@/entity/restaurant";

export type GetRandomRestaurantRequest = z.infer<
  typeof GetRandomRestaurantRequestSchema
>;
export const GetRandomRestaurantRequestSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  distance: DistanceConditionSchema,
  alcohol: AlcoholConditionSchema.optional(),
  prices: z.array(PriceConditionSchema).optional(),
});

export type GetRandomRestaurantResponse = z.infer<
  typeof GetRandomRestaurantResponseSchema
>;
export const GetRandomRestaurantResponseSchema = z.object({
  data: RestaurantSchema,
  nextAvailableAt: z.date(),
  rewardRemainingCount: z.number(),
});

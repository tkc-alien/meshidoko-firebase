import { z } from "zod";

/** レストラン情報 */
export type Restaurant = z.infer<typeof RestaurantSchema>;
export const RestaurantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mapUrl: z.string().url(),
  imageUrl: z.string().url().optional(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.number(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
});

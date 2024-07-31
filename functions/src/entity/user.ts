import { z } from "zod";

export type UID = z.infer<typeof UIDSchema>;
export const UIDSchema = z.string();

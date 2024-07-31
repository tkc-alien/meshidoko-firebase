import { PickStatus, UsedReward } from "@/entity/pick-status";
import { Restaurant } from "@/entity/restaurant";
import admin = require("firebase-admin");

/**
 * Setup
 */
export async function setup() {
  // https://firebase.google.com/docs/emulator-suite/connect_and_prototype?hl=ja
  process.env.FIREBASE_DATABASE_EMULATOR_HOST = "127.0.0.1:9000";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "127.0.0.1:9199";
  process.env.PLACES_API_KEY = "test-places-api-key";

  admin.initializeApp({
    projectId: "meshidoko-stg",
    storageBucket: "test-storage",
    databaseURL: "https://127.0.0.1:9000?ns=test-rtdb",
  });
}

/**
 * Teardown
 */
export async function teardown() {
  await admin.database().ref().remove();
  await admin.storage().bucket().deleteFiles();
  await admin.app().delete();
}

export const baseUsedReward: UsedReward = {
  rewardId: "test-reward-id",
  usedAt: new Date("2000-01-01T03:00:00Z"),
};

export const basePickStatus: PickStatus = {
  cacheId: "test-cache-id",
  pickedAt: new Date("2000-01-01T03:00:00Z"),
  earnedReward: {
    rewardId: "test-reward-id",
    earnedAt: new Date("2000-01-01T03:00:00Z"),
  },
  usedRewards: [baseUsedReward],
};

export const basePickStatusData = {
  cacheId: "test-cache-id",
  pickedAt: "2000-01-01T03:00:00Z",
  earnedReward: {
    rewardId: "test-reward-id",
    earnedAt: "2000-01-01T03:00:00Z",
  },
  usedRewards: [
    {
      rewardId: "test-reward-id",
      usedAt: "2000-01-01T03:00:00Z",
    },
  ],
};

export const baseRestaurant: Restaurant = {
  id: "test-restaurant-id",
  name: "Test Restaurant",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Test Restaurant",
  imageUrl:
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=test-photo-reference-1",
  latitude: 135.1,
  longitude: 35.1,
  distance: 0,
  priceMin: undefined,
  priceMax: undefined,
};

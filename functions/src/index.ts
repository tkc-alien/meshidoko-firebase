/**
 * パスのエイリアスを解決する
 * これ自体にエイリアスを使用できないため、行単位でeslintを無視する
 */
// eslint-disable-next-line no-restricted-imports
import "./paths";

import { setGlobalOptions } from "firebase-functions/v2/options";

// FirebaseAdmin
import admin = require("firebase-admin");

// Functionsオプション
setGlobalOptions({
  region: "asia-northeast1",
  maxInstances: 10,
});

// Firebase初期化
admin.initializeApp();

export { getRandomRestaurantFunction as getRandomRestaurant } from "@/feature/get-ramdom-restaurant/get-random-restaurant.function";

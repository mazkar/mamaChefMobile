// config.js

import { SecureStore } from "expo";

// Disable HTTPS enforcement for Expo SecureStore
SecureStore.HttpsErrorRecovery.disableHttps();

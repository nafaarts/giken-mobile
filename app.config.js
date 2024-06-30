import "dotenv/config";

export default {
  expo: {
    name: "giken-driver",
    slug: "giken-driver",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.giken.driver",
      versionCode: 1,
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      eas: {
        projectId: "f2c1f1a5-a7c4-4642-bdea-9f56713953a6"
      }
    },
    plugins: [
      [
        "expo-notifications", {
          icon: "./assets/icon.png",
          color: "#ffffff",
          defaultChannel: "default",
        }
      ]
    ]
  }
};
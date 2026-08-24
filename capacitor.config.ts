import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.4eb9af74364946eb8796910f061f8d00",
  appName: "Quill",
  webDir: "dist",
  server: {
    // Hot-reload from the Lovable preview during development.
    // Remove `url` (or set to your published domain) before submitting to the App Store / Play Store.
    url: "https://4eb9af74-3649-4eb5-8796-910f061f8d00.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  ios: {
    contentInset: "always",
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0F172A",
      showSpinner: false,
    },
  },
};

export default config;

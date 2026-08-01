import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for Code Quest Academy (Android).
 *
 * This project is a TanStack Start (SSR) application, so the Android shell
 * loads the deployed web app instead of a static bundle. All existing UI,
 * gameplay, missions, XP, badges, mentor, auth and database behaviour is
 * reused exactly as-is — nothing in `src/` is changed by this file.
 *
 * For local development against the Vite dev server, set:
 *   CAP_SERVER_URL=http://192.168.x.x:8080  (your LAN IP, not localhost)
 */
const serverUrl =
  process.env["CAP_SERVER_URL"] ?? "https://cyber-warrior-academy.lovable.app";

const config: CapacitorConfig = {
  appId: "com.codequest.academy",
  appName: "Code Quest Academy",
  // Placeholder for `npx cap sync`; the live content comes from `server.url`.
  webDir: "public",
  android: {
    allowMixedContent: false,
    backgroundColor: "#0a0a1a",
    webContentsDebuggingEnabled: false,
  },
  server: {
    url: serverUrl,
    cleartext: false,
    androidScheme: "https",
    // Allow the Lovable OAuth broker + Cloud backend to be navigated in-app.
    allowNavigation: [
      "cyber-warrior-academy.lovable.app",
      "*.lovable.app",
      "oauth.lovable.app",
      "*.supabase.co",
      "accounts.google.com",
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#0a0a1a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0a0a1a",
      overlaysWebView: false,
    },
  },
};

export default config;

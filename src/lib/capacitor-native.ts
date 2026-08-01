/**
 * Native (Capacitor) bootstrap — no-op on the web.
 *
 * Additive only: hides the splash screen once the app is interactive, styles the
 * status bar, and forwards OAuth/app-link deep links into the existing router.
 * No existing auth, routing, or UI logic is changed.
 */
export async function initNativeShell(): Promise<void> {
  if (typeof window === "undefined") return;

  const { Capacitor } = await import("@capacitor/core");
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch (e) {
    console.warn("SplashScreen unavailable", e);
  }

  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0a0a1a" });
  } catch (e) {
    console.warn("StatusBar unavailable", e);
  }

  try {
    const { App } = await import("@capacitor/app");

    // Deep links / OAuth return: navigate in-place so the SPA keeps its state.
    App.addListener("appUrlOpen", ({ url }) => {
      try {
        const parsed = new URL(url);
        const target = parsed.pathname + parsed.search + parsed.hash;
        window.location.replace(target || "/");
      } catch {
        /* ignore malformed deep links */
      }
    });

    // Android hardware back button walks history, exits only at the root.
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else void App.exitApp();
    });
  } catch (e) {
    console.warn("App plugin unavailable", e);
  }
}

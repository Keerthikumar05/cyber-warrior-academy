# Code Quest Academy — Android (Capacitor) Build Guide

The Android app is a Capacitor shell around the **existing** Code Quest Academy
web application. No UI, gameplay, mission, XP, badge, mentor, leaderboard,
forum, guild, auth, routing or database code was modified.

- **App name:** Code Quest Academy
- **Package ID:** `com.codequest.academy`
- **Content source:** the deployed site (`https://cyber-warrior-academy.lovable.app`)
  configured in `capacitor.config.ts` via `server.url`, because the app is
  server-rendered (TanStack Start) and cannot ship as a static folder.
- **Offline:** the existing PWA service worker (`vite-plugin-pwa`) runs inside the
  Android WebView, so cached shells/assets keep working offline exactly as on web.

---

## 1. Prerequisites

| Tool | Version |
| --- | --- |
| Node / Bun | Node 20+ or Bun 1.1+ |
| Android Studio | Ladybug (2024.2) or newer |
| JDK | 21 (bundled with Android Studio) |
| Android SDK | Platform 35, Build-Tools 35.x |

---

## 2. One-time project setup

```bash
git clone https://github.com/Keerthikumar05/cyber-warrior-academy.git
cd cyber-warrior-academy
bun install                # or: npm install

# Generate the native Android project (creates ./android)
npx cap add android

# Generate launcher icons, adaptive icons and splash screens
npx capacitor-assets generate --android \
  --iconBackgroundColor '#0a0a1a' \
  --splashBackgroundColor '#0a0a1a'

# Copy config + web assets into the native project
npx cap sync android
```

Source art lives in `resources/`:

- `resources/icon.png` — 1024×1024 launcher icon (Code Quest emblem)
- `resources/splash.png` — 1920×1920 splash artwork on `#0a0a1a`

Re-run `npx capacitor-assets generate --android` after replacing either file.

> `android/` is generated output. It is safe to commit or to `.gitignore`;
> every setting needed to recreate it lives in `capacitor.config.ts` and this doc.

---

## 3. Open and run in Android Studio

```bash
npx cap open android
```

1. Let Gradle sync finish.
2. Pick a device/emulator (API 24+).
3. Press **Run ▶**.

Local dev against your machine's Vite server (device and PC on the same Wi-Fi):

```bash
bun run dev                       # serves on 0.0.0.0:8080
CAP_SERVER_URL=http://192.168.1.42:8080 npx cap sync android
```

Use the LAN IP — `localhost` inside the emulator/device points at the device itself.
Cleartext HTTP on a LAN IP also requires temporarily setting
`server.cleartext: true` in `capacitor.config.ts` (never ship that setting).

---

## 4. Google Sign-In inside the Android app

Google blocks OAuth in embedded WebViews (`disallowed_useragent`). The shell
therefore hands the OAuth leg to the system browser (Custom Tabs) and returns
through a deep link. No app auth code changed — Lovable's managed OAuth broker
handles the exchange and Supabase session as it already does on web.

**Required configuration (Cloud → Users → Auth Settings → URL Configuration):**

Add these to *Additional Redirect URLs*:

```
com.codequest.academy://auth/callback
https://cyber-warrior-academy.lovable.app/auth/callback
https://cyber-warrior-academy.lovable.app
```

**Required `android/app/src/main/AndroidManifest.xml` additions** (inside the
main `<activity android:name=".MainActivity">`):

```xml
<!-- Custom scheme deep link (OAuth return) -->
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="com.codequest.academy" />
</intent-filter>

<!-- Verified Android App Links -->
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="https"
        android:host="cyber-warrior-academy.lovable.app" />
</intent-filter>
```

Also confirm `android:launchMode="singleTask"` on `MainActivity` so the deep
link resumes the running app instead of starting a second copy.

**App Links verification:** host
`https://cyber-warrior-academy.lovable.app/.well-known/assetlinks.json`
containing your release signing certificate SHA-256 fingerprint:

```bash
keytool -list -v -keystore codequest-release.keystore -alias codequest | grep SHA256
```

Email/password sign-in works with no extra configuration.

---

## 5. Permissions

Capacitor's default manifest already declares everything the app needs:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Do **not** add camera, location, storage, contacts or microphone permissions —
Code Quest Academy uses none of them, and unnecessary permissions trigger Play
Console data-safety review failures.

---

## 6. Signing key

```bash
keytool -genkey -v \
  -keystore codequest-release.keystore \
  -alias codequest \
  -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore **outside** the repo and never commit it. Create
`android/keystore.properties` (git-ignored):

```properties
storeFile=/absolute/path/to/codequest-release.keystore
storePassword=********
keyAlias=codequest
keyPassword=********
```

Wire it up in `android/app/build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Bump `versionCode` (integer, must increase every upload) and `versionName`
(e.g. `1.0.0`) in `android/app/build.gradle` for each release.

---

## 7. Build a signed APK

Android Studio: **Build → Generate Signed App Bundle / APK → APK → release**.

CLI:

```bash
npx cap sync android
cd android
./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

Install on a device:

```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

## 8. Build a signed AAB (Play Store)

```bash
cd android
./gradlew bundleRelease
# → android/app/build/outputs/bundle/release/app-release.aab
```

Verify before upload:

```bash
bundletool build-apks --bundle=app-release.aab --output=cq.apks \
  --ks=codequest-release.keystore --ks-key-alias=codequest
bundletool install-apks --apks=cq.apks
```

---

## 9. Play Store deployment checklist

- [ ] Package ID `com.codequest.academy` matches the Play Console listing
- [ ] `versionCode` incremented, `versionName` set to `1.0.0`
- [ ] Signed AAB built with the release keystore (keystore backed up securely)
- [ ] Play App Signing enrolled; upload-key SHA-256 added to `assetlinks.json`
- [ ] Target SDK 35 (Play requirement)
- [ ] App icon 512×512 PNG (from `resources/icon.png`)
- [ ] Feature graphic 1024×500
- [ ] At least 2 phone screenshots (plus 7" / 10" tablet if targeting tablets)
- [ ] Short description (≤80 chars) and full description (≤4000 chars)
- [ ] Privacy policy URL published and reachable
- [ ] Data safety form: account data (email, name) collected via sign-in; no ads,
      no location, no device-ID tracking
- [ ] Content rating questionnaire completed (Education)
- [ ] Category: Education
- [ ] Google Sign-In verified on a physical device with the release build
- [ ] Deep links verified: `adb shell am start -a android.intent.action.VIEW -d "https://cyber-warrior-academy.lovable.app/quests"`
- [ ] Offline behaviour verified (airplane mode after first load)
- [ ] Internal testing track release passed before production rollout

---

## 10. Updating the app

Because content is served from the deployed web app, **web releases reach users
instantly** — no Play Store submission required for content, mission or UI
changes. A new Play upload is only needed when native config changes: package
ID, icons, splash, permissions, plugins, or targetSdk.

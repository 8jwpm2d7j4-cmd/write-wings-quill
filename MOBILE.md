# Quill — iOS & Android (Capacitor)

This project ships a native wrapper via [Capacitor](https://capacitorjs.com/) so the same React app runs on iPhone and Android.

> Native builds require a real machine — Xcode (macOS) for iOS, Android Studio for Android. They cannot be compiled inside Lovable.

## 1. Get the code locally

1. Push the project to GitHub via the **GitHub** button in Lovable.
2. Clone your repo and `cd` into it.
3. `npm install` (or `bun install`).

## 2. Add the native platforms

```bash
# Build the web bundle that Capacitor will wrap
npm run build

# Add the platforms (creates ./ios and ./android folders)
npx cap add ios
npx cap add android

# Sync the web build + plugins into the native projects
npx cap sync
```

Re-run `npm run build && npx cap sync` after every web change.

## 3. Run on device / simulator

**iOS** (macOS + Xcode required):
```bash
npx cap run ios
# or open the workspace:
npx cap open ios
```

**Android** (Android Studio required):
```bash
npx cap run android
# or:
npx cap open android
```

## 4. Hot reload during development

`capacitor.config.ts` points `server.url` at the Lovable preview, so the native app loads the live preview and refreshes as you edit in Lovable. **Before shipping to the App Store or Play Store, delete the `server.url` block** so the app loads the bundled `dist/` instead of the preview URL.

## 5. Going live on the stores

App Store and Play Store both require **In-App Purchases** for digital goods — Paddle subscriptions and tip checkouts will be rejected. Wrap purchases with [@capgo/capacitor-purchases](https://github.com/Cap-go/capacitor-purchases) or RevenueCat before submission, and gate them behind `Capacitor.isNativePlatform()`.

You'll also need:
- Apple Developer account ($99/yr) and Google Play Console ($25 one-time)
- App icons + splash screens (drop into `ios/App/App/Assets.xcassets` and `android/app/src/main/res/`)
- Privacy policy URL + data-safety form (we collect email, content, payments)
- Bundle ID `app.lovable.4eb9af74364946eb8796910f061f8d00` — change to your own reverse-DNS in `capacitor.config.ts` before first build

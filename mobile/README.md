# Listening Discrimination Trainer — React Native (Expo)

Same app as the web/Electron version: listen to one of two options, guess which one, track accuracy. Uses **expo-speech** for platform TTS (iOS/Android).

## Run

```bash
cd mobile
npm start
```

Then press `a` for Android or `i` for iOS in the terminal, or scan the QR code with Expo Go.

- **Android:** `npm run android`
- **iOS:** `npm run ios` (macOS with Xcode)
- **Web:** `npm run web` (limited TTS support in browser)

## Structure

- `App.tsx` — main screen: filters, round (play, two options, feedback, next), stats
- `src/types/minimal-pairs.ts` — shared types
- `src/data/minimal-pairs.json` — minimal pairs (same data as web app)
- `src/services/tts.ts` — expo-speech wrapper (play one option, play again)
- `src/hooks/useSession.ts` — round history with AsyncStorage persistence

Session and score persist across app restarts.

# Listening Discrimination Trainer

Practice listening discrimination with **minimal pairs**: the app speaks one of two options (e.g. “shi” vs “xi”, “ship” vs “sheep”), you choose which one you heard, and your score is tracked. No pre-recorded audio — everything is generated with **text-to-speech** (TTS).

Part of [Xenolexia](https://github.com/Xenolexia).

## Features

- **Minimal pairs** for Mandarin (zh-CN), Spanish (es-ES), and English vowels (en-US), with categories (consonants, vowels, tones, words).
- **Play** one option at random with correct language; **Play again** to replay the same word.
- **Two choice buttons** in random order; clear correct/incorrect feedback and optional answer reveal.
- **Score & accuracy** (e.g. 7/10 — 70%) with per-language breakdown; session persists until you reset.
- **Filters** by language and category (e.g. Mandarin only, vowels only).
- **Keyboard shortcuts** (web): `Space` = play, `1` / `2` = choose first or second option.
- **Onboarding** (dismissible) explaining the flow.

## Run the app

### Web (browser)

```bash
npm install
npm run dev
```

Open http://localhost:5173. Uses the **Web Speech API** (Chrome, Edge, Safari recommended).

**Production build:** `npm run build` → output in `dist/`. Preview: `npm run preview`.

### Electron (desktop)

```bash
npm install
npm run electron:dev    # dev with hot reload (Vite + Electron)
npm run electron        # run built app (run npm run build first)
npm run electron:build  # build installers → release/
```

### React Native (Expo)

```bash
cd mobile
npm install
npm start
```

Then press **a** (Android) or **i** (iOS), or scan the QR code with [Expo Go](https://expo.dev/go). Uses **expo-speech** for TTS. Session is stored with AsyncStorage.

- `npm run android` / `npm run ios` / `npm run web` from `mobile/` also work.

## Project structure

```
├── src/                    # Web app (Vite + React)
│   ├── types/              # MinimalPair, Round, SessionStats
│   ├── data/               # minimal-pairs.json + getMinimalPairs, filters
│   ├── services/           # TTS (Web Speech API)
│   ├── components/         # Round, Stats, Onboarding
│   └── hooks/              # useSession (localStorage)
├── electron/               # Electron main process
│   └── main.js
├── mobile/                 # React Native (Expo) app
│   ├── App.tsx
│   └── src/                # types, data, services/tts (expo-speech), hooks
├── index.html
├── vite.config.ts
├── package.json
└── IMPLEMENTATION_PLAN.md   # Phased plan (Phases 1–5)
```

Minimal pairs data lives in:

- **Web/Electron:** `src/data/minimal-pairs.json` (loaded by `src/data/minimal-pairs.ts`).
- **Mobile:** `mobile/src/data/minimal-pairs.json` (same content; mobile app is self-contained).

Add or edit pairs in these JSON files to support more languages or categories without changing game logic.

## Tech stack

| Layer      | Web / Electron      | Mobile        |
|-----------|---------------------|---------------|
| Framework | Vite + React        | Expo (React Native) |
| Language  | TypeScript          | TypeScript    |
| TTS       | Web Speech API      | expo-speech   |
| Session   | localStorage        | AsyncStorage  |

## License

Private. See repository for terms.

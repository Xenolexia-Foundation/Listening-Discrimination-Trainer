/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

/**
 * TTS service using the Web Speech API (speechSynthesis).
 * One utterance at a time; speak() resolves when playback completes or fails.
 * Robust to errors and optionally uses a voice that matches the requested language.
 */

import type { MinimalPair, PairOption } from '../types/minimal-pairs';

const DEFAULT_LANG = 'en-US';
const PLAYBACK_TIMEOUT_MS = 10_000;

/** User-facing message when playback fails (for 5.3 robustness). */
export const TTS_ERROR_MESSAGE = 'Could not play; try again.';

/** True if the environment supports speech synthesis. */
export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Pick a voice that matches the given language code, if available. */
function getVoiceForLang(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang === lang || v.lang.startsWith(lang.split('-')[0] ?? ''));
  return match ?? null;
}

/**
 * Speak text with optional language (BCP 47).
 * Queues one utterance at a time: any current speech is cancelled before starting.
 * Prefers a voice that matches the language when available.
 * Resolves when playback ends or on error; rejects on error or timeout.
 */
export function speak(text: string, lang?: string): Promise<void> {
  if (!isSupported()) {
    return Promise.reject(new Error('Speech synthesis is not supported in this browser.'));
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const language = lang ?? DEFAULT_LANG;
  const voice = getVoiceForLang(language);

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;

    const cleanup = () => {
      clearTimeout(timer);
      utterance.onend = null;
      utterance.onerror = null;
    };

    const timer = setTimeout(() => {
      cleanup();
      synth.cancel();
      reject(new Error(TTS_ERROR_MESSAGE));
    }, PLAYBACK_TIMEOUT_MS);

    utterance.onend = () => {
      cleanup();
      resolve();
    };

    utterance.onerror = () => {
      cleanup();
      reject(new Error(TTS_ERROR_MESSAGE));
    };

    synth.speak(utterance);
  });
}

/**
 * Play a specific option (A or B) of a minimal pair. Use for "Play again" to replay the same word.
 */
export async function playOption(pair: MinimalPair, option: PairOption): Promise<void> {
  const text = option === 'A' ? pair.optionA : pair.optionB;
  const lang = pair.language ?? DEFAULT_LANG;
  await speak(text, lang);
}

/**
 * Pick option A or B at random, speak it with the pair's language, and return which was played.
 * Use for "play one of the pair" so the user can guess which one they heard.
 */
export async function playOneOption(pair: MinimalPair): Promise<PairOption> {
  const option: PairOption = Math.random() < 0.5 ? 'A' : 'B';
  await playOption(pair, option);
  return option;
}

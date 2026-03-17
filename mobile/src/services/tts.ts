/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import * as Speech from 'expo-speech';
import type { MinimalPair, PairOption } from '../types/minimal-pairs';

const DEFAULT_LANG = 'en-US';

export const TTS_ERROR_MESSAGE = 'Could not play; try again.';

export function playOption(pair: MinimalPair, option: PairOption): Promise<void> {
  const text = option === 'A' ? pair.optionA : pair.optionB;
  const lang = pair.language ?? DEFAULT_LANG;
  return new Promise((resolve, reject) => {
    Speech.stop();
    Speech.speak(text, {
      language: lang,
      rate: 0.9,
      onDone: () => resolve(),
      onError: (err) => reject(new Error(TTS_ERROR_MESSAGE)),
    });
  });
}

export function playOneOption(pair: MinimalPair): Promise<PairOption> {
  const option: PairOption = Math.random() < 0.5 ? 'A' : 'B';
  return playOption(pair, option).then(() => option);
}

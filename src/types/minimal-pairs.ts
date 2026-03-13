/**
 * Core types for the Listening Discrimination Trainer.
 * TTS speaks one of optionA/optionB; user guesses which one was played.
 */

/** A single minimal pair: two options (syllables, words, or phonemes) that TTS will speak. */
export interface MinimalPair {
  id: string;
  optionA: string;
  optionB: string;
  /** BCP 47 language code for TTS (e.g. "zh-CN", "es-ES", "en-US"). */
  language?: string;
  /** Optional category for filtering (e.g. "consonants", "vowels", "tones"). */
  category?: string;
}

/** A list of minimal pairs, optionally grouped by language/category. */
export type MinimalPairSet = MinimalPair[];

/** Which option was the correct one in a round. */
export type PairOption = 'A' | 'B';

/** Result of one round: which pair was used, correct option, user's choice, and outcome. */
export interface Round {
  pairId: string;
  correctOption: PairOption;
  userChoice: PairOption;
  correct: boolean;
}

/** Session-level stats: total rounds, correct count, and accuracy. */
export interface SessionStats {
  totalRounds: number;
  correct: number;
  /** 0–100, or 0 when totalRounds === 0. */
  accuracy: number;
}

/** Compute SessionStats from a list of rounds. */
export function computeSessionStats(rounds: Round[]): SessionStats {
  const totalRounds = rounds.length;
  const correct = rounds.filter((r) => r.correct).length;
  const accuracy = totalRounds === 0 ? 0 : Math.round((correct / totalRounds) * 100);
  return { totalRounds, correct, accuracy };
}

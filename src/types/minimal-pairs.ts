/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

/**
 * Core types for the Listening Discrimination Trainer.
 * TTS speaks one of optionA/optionB; user guesses which one was played.
 */

export type { MinimalPair, MinimalPairSet } from '@xenolexia/dict';

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

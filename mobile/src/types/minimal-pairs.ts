/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

export type { MinimalPair, MinimalPairSet } from '@xenolexia/dict';
export type PairOption = 'A' | 'B';

export interface Round {
  pairId: string;
  correctOption: PairOption;
  userChoice: PairOption;
  correct: boolean;
}

export interface SessionStats {
  totalRounds: number;
  correct: number;
  accuracy: number;
}

export function computeSessionStats(rounds: Round[]): SessionStats {
  const totalRounds = rounds.length;
  const correct = rounds.filter((r) => r.correct).length;
  const accuracy = totalRounds === 0 ? 0 : Math.round((correct / totalRounds) * 100);
  return { totalRounds, correct, accuracy };
}

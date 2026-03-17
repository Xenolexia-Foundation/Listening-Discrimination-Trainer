/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect } from 'vitest';
import { computeSessionStats, type Round } from './minimal-pairs';

describe('computeSessionStats', () => {
  it('returns zeros when no rounds', () => {
    expect(computeSessionStats([])).toEqual({
      totalRounds: 0,
      correct: 0,
      accuracy: 0,
    });
  });

  it('returns 100% when all correct', () => {
    const rounds: Round[] = [
      { pairId: '1', correctOption: 'A', userChoice: 'A', correct: true },
      { pairId: '2', correctOption: 'B', userChoice: 'B', correct: true },
    ];
    expect(computeSessionStats(rounds)).toEqual({
      totalRounds: 2,
      correct: 2,
      accuracy: 100,
    });
  });

  it('returns 0% when all wrong', () => {
    const rounds: Round[] = [
      { pairId: '1', correctOption: 'A', userChoice: 'B', correct: false },
    ];
    expect(computeSessionStats(rounds)).toEqual({
      totalRounds: 1,
      correct: 0,
      accuracy: 0,
    });
  });

  it('rounds accuracy to integer', () => {
    const rounds: Round[] = [
      { pairId: '1', correctOption: 'A', userChoice: 'A', correct: true },
      { pairId: '2', correctOption: 'B', userChoice: 'A', correct: false },
      { pairId: '3', correctOption: 'A', userChoice: 'A', correct: true },
    ];
    expect(computeSessionStats(rounds)).toEqual({
      totalRounds: 3,
      correct: 2,
      accuracy: 67,
    });
  });
});

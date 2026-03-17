/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect } from 'vitest';
import { getMinimalPairs, LANGUAGES, CATEGORIES, MINIMAL_PAIRS } from './minimal-pairs';

describe('minimal-pairs data', () => {
  it('exports MINIMAL_PAIRS as non-empty array', () => {
    expect(Array.isArray(MINIMAL_PAIRS)).toBe(true);
    expect(MINIMAL_PAIRS.length).toBeGreaterThan(0);
  });

  it('each pair has id, optionA, optionB', () => {
    for (const p of MINIMAL_PAIRS) {
      expect(typeof p.id).toBe('string');
      expect(typeof p.optionA).toBe('string');
      expect(typeof p.optionB).toBe('string');
    }
  });

  it('LANGUAGES is array of strings', () => {
    expect(Array.isArray(LANGUAGES)).toBe(true);
    LANGUAGES.forEach((l) => expect(typeof l).toBe('string'));
  });

  it('CATEGORIES is array of strings', () => {
    expect(Array.isArray(CATEGORIES)).toBe(true);
    CATEGORIES.forEach((c) => expect(typeof c).toBe('string'));
  });

  it('getMinimalPairs returns all when no filter', () => {
    const result = getMinimalPairs();
    expect(result).toEqual(MINIMAL_PAIRS);
  });

  it('getMinimalPairs filters by language when provided', () => {
    const lang = LANGUAGES[0];
    if (!lang) return;
    const result = getMinimalPairs({ language: lang });
    expect(result.every((p) => p.language === lang)).toBe(true);
  });

  it('getMinimalPairs filters by category when provided', () => {
    const cat = CATEGORIES[0];
    if (!cat) return;
    const result = getMinimalPairs({ category: cat });
    expect(result.every((p) => p.category === cat)).toBe(true);
  });
});

import type { MinimalPairSet } from '../types/minimal-pairs';

import pairsJson from './minimal-pairs.json';

/** Loaded minimal pairs — add or edit minimal-pairs.json to add more without touching game logic. */
const MINIMAL_PAIRS: MinimalPairSet = pairsJson as MinimalPairSet;

export { MINIMAL_PAIRS };

/** All unique languages in the minimal-pairs list. */
export const LANGUAGES = [...new Set(MINIMAL_PAIRS.map((p) => p.language).filter(Boolean))] as string[];

/** All unique categories in the minimal-pairs list. */
export const CATEGORIES = [...new Set(MINIMAL_PAIRS.map((p) => p.category).filter(Boolean))] as string[];

/**
 * Get minimal pairs, optionally filtered by language and/or category.
 */
export function getMinimalPairs(options?: {
  language?: string;
  category?: string;
}): MinimalPairSet {
  if (!options?.language && !options?.category) return [...MINIMAL_PAIRS];
  return MINIMAL_PAIRS.filter((p) => {
    if (options.language && p.language !== options.language) return false;
    if (options.category && p.category !== options.category) return false;
    return true;
  });
}

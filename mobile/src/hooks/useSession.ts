/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Round } from '../types/minimal-pairs';

const STORAGE_KEY = '@listening_discrimination_session';

function isValidRound(x: unknown): x is Round {
  return (
    typeof x === 'object' &&
    x !== null &&
    'pairId' in x &&
    'correctOption' in x &&
    'userChoice' in x &&
    'correct' in x &&
    typeof (x as Round).pairId === 'string' &&
    ((x as Round).correctOption === 'A' || (x as Round).correctOption === 'B') &&
    ((x as Round).userChoice === 'A' || (x as Round).userChoice === 'B') &&
    typeof (x as Round).correct === 'boolean'
  );
}

export function useSession(): [Round[], Dispatch<SetStateAction<Round[]>>, () => void] {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter(isValidRound) : [];
      })
      .then((loadedRounds) => {
        setRounds(loadedRounds);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rounds)).catch(() => {});
  }, [rounds, loaded]);

  const resetSession = useCallback(() => setRounds([]), []);

  return [rounds, setRounds, resetSession];
}

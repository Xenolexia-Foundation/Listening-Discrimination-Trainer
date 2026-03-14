/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { useState, useCallback, useMemo, useEffect } from 'react'
import { getMinimalPairs, LANGUAGES, CATEGORIES } from './data/minimal-pairs'
import { isSupported, playOneOption, playOption, TTS_ERROR_MESSAGE } from './services/tts'
import { Round } from './components/Round'
import { Stats } from './components/Stats'
import { Onboarding } from './components/Onboarding'
import { useSession } from './hooks/useSession'
import type { MinimalPair, PairOption } from './types/minimal-pairs'

function pickRandomPair(pairs: MinimalPair[]): MinimalPair | null {
  if (pairs.length === 0) return null;
  return pairs[Math.floor(Math.random() * pairs.length)] ?? null;
}

function randomOptionsOrder(): [PairOption, PairOption] {
  return Math.random() < 0.5 ? ['A', 'B'] : ['B', 'A'];
}

function App() {
  const [languageFilter, setLanguageFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const pairs = useMemo(
    () =>
      getMinimalPairs({
        language: languageFilter || undefined,
        category: categoryFilter || undefined,
      }),
    [languageFilter, categoryFilter]
  );

  useEffect(() => {
    const filtered = getMinimalPairs({
      language: languageFilter || undefined,
      category: categoryFilter || undefined,
    });
    const next = pickRandomPair(filtered);
    setCurrentPair(next ?? ({} as MinimalPair));
    setCorrectOption(null);
    setUserChoice(null);
    setOptionsOrder(randomOptionsOrder());
    setPlayStatus('idle');
    setErrorMessage(null);
  }, [languageFilter, categoryFilter]);

  const [rounds, setRounds, resetSession] = useSession();
  const pairsById = useMemo(() => {
    const map = new Map<string, MinimalPair>();
    for (const p of pairs) map.set(p.id, p);
    return map;
  }, [pairs]);

  const [currentPair, setCurrentPair] = useState<MinimalPair>(() => pickRandomPair(pairs) ?? ({} as MinimalPair));
  const [correctOption, setCorrectOption] = useState<PairOption | null>(null);
  const [userChoice, setUserChoice] = useState<PairOption | null>(null);
  const [optionsOrder, setOptionsOrder] = useState<[PairOption, PairOption]>(randomOptionsOrder);
  const [playStatus, setPlayStatus] = useState<'idle' | 'playing' | 'played' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startNewRound = useCallback(() => {
    const next = pickRandomPair(pairs);
    setCurrentPair(next ?? ({} as MinimalPair));
    setCorrectOption(null);
    setUserChoice(null);
    setOptionsOrder(randomOptionsOrder());
    setPlayStatus('idle');
    setErrorMessage(null);
  }, [pairs]);

  const handlePlay = useCallback(async () => {
    if (!currentPair.id || !isSupported()) {
      if (!isSupported()) setErrorMessage('Speech synthesis is not supported.');
      return;
    }
    setErrorMessage(null);
    setPlayStatus('playing');
    try {
      if (correctOption === null) {
        const option = await playOneOption(currentPair);
        setCorrectOption(option);
      } else {
        await playOption(currentPair, correctOption);
      }
      setPlayStatus('played');
    } catch {
      setErrorMessage(TTS_ERROR_MESSAGE);
      setPlayStatus('error');
    }
  }, [currentPair, correctOption]);

  const handleChoose = useCallback(
    (option: PairOption) => {
      if (correctOption === null) return;
      setRounds((prev) => [
        ...prev,
        {
          pairId: currentPair.id,
          correctOption,
          userChoice: option,
          correct: option === correctOption,
        },
      ]);
      setUserChoice(option);
    },
    [currentPair.id, correctOption, setRounds]
  );

  const handleNext = useCallback(() => {
    startNewRound();
  }, [startNewRound]);

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui' }}>
      <h1>Listening Discrimination Trainer</h1>

      {!onboardingDismissed && (
        <Onboarding onDismiss={() => setOnboardingDismissed(true)} />
      )}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
        <label>
          Language{' '}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            aria-label="Filter by language"
          >
            <option value="">All</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </label>
        <label>
          Category{' '}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
      </div>

      {!isSupported() && (
        <p style={{ color: 'crimson', marginTop: '0.5rem' }}>
          Speech synthesis is not supported. Try a modern browser (Chrome, Edge, Safari).
        </p>
      )}

      {pairs.length === 0 && (
        <p style={{ marginTop: '1rem', color: '#666' }}>No pairs match the current filter. Choose different language or category.</p>
      )}

      {currentPair.id && pairs.length > 0 && (
        <Round
          pair={currentPair}
          correctOption={correctOption}
          userChoice={userChoice}
          optionsOrder={optionsOrder}
          playStatus={playStatus}
          errorMessage={errorMessage}
          onPlay={handlePlay}
          onChoose={handleChoose}
          onNext={handleNext}
        />
      )}

      <Stats rounds={rounds} pairsById={pairsById} onReset={resetSession} />
    </div>
  );
}

export default App;

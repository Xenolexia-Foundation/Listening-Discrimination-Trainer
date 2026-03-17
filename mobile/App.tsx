/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {
  getMinimalPairs,
  LANGUAGES,
  CATEGORIES,
} from './src/data/minimal-pairs';
import { playOneOption, playOption, TTS_ERROR_MESSAGE } from './src/services/tts';
import { useSession } from './src/hooks/useSession';
import { computeSessionStats } from './src/types/minimal-pairs';
import type { MinimalPair, PairOption } from './src/types/minimal-pairs';

function pickRandomPair(pairs: MinimalPair[]): MinimalPair | null {
  if (pairs.length === 0) return null;
  return pairs[Math.floor(Math.random() * pairs.length)] ?? null;
}

function randomOptionsOrder(): [PairOption, PairOption] {
  return Math.random() < 0.5 ? ['A', 'B'] : ['B', 'A'];
}

export default function App() {
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

  const [rounds, setRounds, resetSession] = useSession();
  const pairsById = useMemo(() => {
    const map = new Map<string, MinimalPair>();
    for (const p of pairs) map.set(p.id, p);
    return map;
  }, [pairs]);

  const [currentPair, setCurrentPair] = useState<MinimalPair | null>(null);
  const [correctOption, setCorrectOption] = useState<PairOption | null>(null);
  const [userChoice, setUserChoice] = useState<PairOption | null>(null);
  const [optionsOrder, setOptionsOrder] = useState<[PairOption, PairOption]>(['A', 'B']);
  const [playStatus, setPlayStatus] = useState<'idle' | 'playing' | 'played' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startNewRound = useCallback(() => {
    const next = pickRandomPair(pairs);
    setCurrentPair(next);
    setCorrectOption(null);
    setUserChoice(null);
    setOptionsOrder(randomOptionsOrder());
    setPlayStatus('idle');
    setErrorMessage(null);
  }, [pairs]);

  useEffect(() => {
    const next = pickRandomPair(pairs);
    setCurrentPair(next);
    setCorrectOption(null);
    setUserChoice(null);
    setOptionsOrder(randomOptionsOrder());
    setPlayStatus('idle');
    setErrorMessage(null);
  }, [languageFilter, categoryFilter]);

  const handlePlay = useCallback(async () => {
    if (!currentPair) return;
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
          pairId: currentPair!.id,
          correctOption,
          userChoice: option,
          correct: option === correctOption,
        },
      ]);
      setUserChoice(option);
    },
    [currentPair, correctOption, setRounds]
  );

  const stats = computeSessionStats(rounds);
  const canChoose = correctOption !== null && userChoice === null;
  const hasChosen = userChoice !== null;
  const [first, second] = optionsOrder;
  const label = (option: PairOption) =>
    currentPair ? (option === 'A' ? currentPair.optionA : currentPair.optionB) : '';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Listening Discrimination Trainer</Text>

        {!onboardingDismissed && (
          <View style={styles.onboarding}>
            <Text style={styles.onboardingText}>
              You'll hear one of two options. Choose which one you heard. Tap "Play again" to replay.
            </Text>
            <Pressable style={styles.buttonSmall} onPress={() => setOnboardingDismissed(true)}>
              <Text style={styles.buttonText}>Got it</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.filters}>
          <Text style={styles.filterLabel}>Language:</Text>
          <View style={styles.chips}>
            <Pressable
              style={[styles.chip, !languageFilter && styles.chipActive]}
              onPress={() => setLanguageFilter('')}
            >
              <Text style={[styles.chipText, !languageFilter && styles.chipTextActive]}>All</Text>
            </Pressable>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                style={[styles.chip, languageFilter === lang && styles.chipActive]}
                onPress={() => setLanguageFilter(lang)}
              >
                <Text style={[styles.chipText, languageFilter === lang && styles.chipTextActive]}>{lang}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.filterLabel}>Category:</Text>
          <View style={styles.chips}>
            <Pressable
              style={[styles.chip, !categoryFilter && styles.chipActive]}
              onPress={() => setCategoryFilter('')}
            >
              <Text style={[styles.chipText, !categoryFilter && styles.chipTextActive]}>All</Text>
            </Pressable>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.chip, categoryFilter === cat && styles.chipActive]}
                onPress={() => setCategoryFilter(cat)}
              >
                <Text style={[styles.chipText, categoryFilter === cat && styles.chipTextActive]}>{cat}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {pairs.length === 0 && (
          <Text style={styles.empty}>No pairs match the filter.</Text>
        )}

        {currentPair && pairs.length > 0 && (
          <View style={styles.round}>
            <Text style={styles.hint}>
              {currentPair.language ? `${currentPair.language} — ` : ''}Listen, then choose.
            </Text>

            <Pressable
              style={[styles.button, playStatus === 'playing' && styles.buttonDisabled]}
              onPress={handlePlay}
              disabled={playStatus === 'playing'}
            >
              <Text style={styles.buttonText}>
                {correctOption === null ? 'Play' : 'Play again'}
              </Text>
            </Pressable>
            {playStatus === 'playing' && <Text style={styles.playing}>Playing…</Text>}
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <View style={styles.options}>
              <Pressable
                style={[
                  styles.optionButton,
                  hasChosen && first === correctOption && styles.optionCorrect,
                  hasChosen && first === userChoice && first !== correctOption && styles.optionWrong,
                ]}
                onPress={() => handleChoose(first)}
                disabled={!canChoose}
              >
                <Text style={styles.optionText}>{label(first)}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.optionButton,
                  hasChosen && second === correctOption && styles.optionCorrect,
                  hasChosen && second === userChoice && second !== correctOption && styles.optionWrong,
                ]}
                onPress={() => handleChoose(second)}
                disabled={!canChoose}
              >
                <Text style={styles.optionText}>{label(second)}</Text>
              </Pressable>
            </View>

            {hasChosen && correctOption !== null && (
              <Text style={styles.feedback}>
                {userChoice === correctOption
                  ? 'Correct!'
                  : `Incorrect. It was "${label(correctOption)}".`}
              </Text>
            )}

            <Pressable style={[styles.button, styles.buttonNext]} onPress={startNewRound}>
              <Text style={styles.buttonText}>Next</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Score: {stats.correct}/{stats.totalRounds} — {stats.accuracy}%
          </Text>
          <Pressable style={styles.buttonSmall} onPress={resetSession}>
            <Text style={styles.buttonText}>Reset session</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  onboarding: {
    backgroundColor: '#e8f4fc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#b8d4e8',
  },
  onboardingText: { marginBottom: 8 },
  buttonSmall: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2196F3',
    borderRadius: 6,
  },
  filters: { marginBottom: 16 },
  filterLabel: { fontSize: 14, color: '#555', marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 16,
  },
  chipActive: { backgroundColor: '#2196F3' },
  chipText: { color: '#000', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  empty: { color: '#666', marginBottom: 16 },
  round: { marginBottom: 24 },
  hint: { color: '#666', marginBottom: 8 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonNext: { marginTop: 16 },
  buttonText: { color: '#fff', fontWeight: '600' },
  playing: { marginTop: 8, color: '#666' },
  error: { marginTop: 8, color: 'crimson' },
  options: { flexDirection: 'row', gap: 12, marginTop: 16, flexWrap: 'wrap' },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCorrect: { borderColor: 'green', backgroundColor: 'rgba(0,128,0,0.1)' },
  optionWrong: { borderColor: 'crimson', backgroundColor: 'rgba(220,20,60,0.1)' },
  optionText: { fontSize: 18 },
  feedback: { marginTop: 12, fontWeight: '600', fontSize: 16 },
  stats: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsText: { fontWeight: '600' },
});

import { computeSessionStats } from '../types/minimal-pairs'
import type { Round } from '../types/minimal-pairs'
import type { MinimalPair } from '../types/minimal-pairs'

export interface StatsProps {
  rounds: Round[]
  /** Optional: pairs lookup for per-language/category stats. */
  pairsById?: Map<string, MinimalPair>
  onReset?: () => void
}

export function Stats({ rounds, pairsById, onReset }: StatsProps) {
  const stats = computeSessionStats(rounds)

  if (stats.totalRounds === 0) {
    return (
      <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: 6 }}>
        <span style={{ color: '#666' }}>Score: 0/0 — 0%</span>
        {onReset && (
          <button type="button" onClick={onReset} style={{ marginLeft: '0.75rem' }}>
            Reset session
          </button>
        )}
      </div>
    )
  }

  const perLanguage = pairsById && stats.totalRounds > 0
    ? getPerLanguageStats(rounds, pairsById)
    : []

  return (
    <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: '#f5f5f5', borderRadius: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <strong>Score: {stats.correct}/{stats.totalRounds} — {stats.accuracy}%</strong>
        {onReset && (
          <button type="button" onClick={onReset}>
            Reset session
          </button>
        )}
      </div>
      {perLanguage.length > 0 && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
          {perLanguage.map(({ language, correct, total, accuracy }) => (
            <span key={language} style={{ marginRight: '1rem' }}>
              {language}: {correct}/{total} — {accuracy}%
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function getPerLanguageStats(
  rounds: Round[],
  pairsById: Map<string, MinimalPair>
): { language: string; correct: number; total: number; accuracy: number }[] {
  const byLang = new Map<string, { correct: number; total: number }>()
  for (const r of rounds) {
    const pair = pairsById.get(r.pairId)
    const lang = pair?.language ?? 'unknown'
    const cur = byLang.get(lang) ?? { correct: 0, total: 0 }
    cur.total += 1
    if (r.correct) cur.correct += 1
    byLang.set(lang, cur)
  }
  return [...byLang.entries()].map(([language, { correct, total }]) => ({
    language,
    correct,
    total,
    accuracy: total === 0 ? 0 : Math.round((correct / total) * 100),
  }))
}

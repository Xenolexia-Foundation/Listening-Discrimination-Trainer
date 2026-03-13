import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react'
import type { Round } from '../types/minimal-pairs'

const STORAGE_KEY = 'listening-discrimination-session'

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
  )
}

function loadRounds(): Round[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidRound)
  } catch {
    return []
  }
}

function saveRounds(rounds: Round[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds))
  } catch {
    // ignore
  }
}

/**
 * Session state: rounds persist in localStorage and are restored on load.
 * Returns [rounds, setRounds, resetSession].
 */
export function useSession(): [Round[], Dispatch<SetStateAction<Round[]>>, () => void] {
  const [rounds, setRounds] = useState<Round[]>(loadRounds)

  useEffect(() => {
    saveRounds(rounds)
  }, [rounds])

  const resetSession = useCallback(() => {
    setRounds([])
  }, [])

  return [rounds, setRounds, resetSession]
}

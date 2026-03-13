import { useEffect } from 'react';
import type { MinimalPair, PairOption } from '../types/minimal-pairs';

export interface RoundProps {
  pair: MinimalPair;
  correctOption: PairOption | null;
  userChoice: PairOption | null;
  optionsOrder: [PairOption, PairOption];
  playStatus: 'idle' | 'playing' | 'played' | 'error';
  errorMessage: string | null;
  onPlay: () => void;
  onChoose: (option: PairOption) => void;
  onNext: () => void;
}

export function Round({
  pair,
  correctOption,
  userChoice,
  optionsOrder,
  playStatus,
  errorMessage,
  onPlay,
  onChoose,
  onNext,
}: RoundProps) {
  const canChoose = correctOption !== null && userChoice === null;
  const hasChosen = userChoice !== null;
  const [first, second] = optionsOrder;
  const label = (option: PairOption) => (option === 'A' ? pair.optionA : pair.optionB);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (playStatus !== 'playing') onPlay();
      }
      if (e.key === '1' && canChoose) onChoose(first);
      if (e.key === '2' && canChoose) onChoose(second);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playStatus, canChoose, first, second, onPlay, onChoose]);

  return (
    <section style={{ marginTop: '1rem' }}>
      <p style={{ marginBottom: '0.5rem' }}>
        {pair.language && <span style={{ color: '#666' }}>{pair.language} — </span>}
        Listen, then choose which one you heard.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onPlay}
          disabled={playStatus === 'playing'}
        >
          {correctOption === null ? 'Play' : 'Play again'}
        </button>
        {playStatus === 'playing' && <span>Playing…</span>}
      </div>

      {errorMessage && (
        <p style={{ color: 'crimson', marginTop: '0.5rem' }}>{errorMessage}</p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onChoose(first)}
          disabled={!canChoose}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            ...(hasChosen && first === correctOption
              ? { outline: '2px solid green', backgroundColor: 'rgba(0,128,0,0.1)' }
              : hasChosen && first === userChoice
                ? { outline: '2px solid crimson', backgroundColor: 'rgba(220,20,60,0.1)' }
                : {}),
          }}
        >
          {label(first)}
        </button>
        <button
          type="button"
          onClick={() => onChoose(second)}
          disabled={!canChoose}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            ...(hasChosen && second === correctOption
              ? { outline: '2px solid green', backgroundColor: 'rgba(0,128,0,0.1)' }
              : hasChosen && second === userChoice
                ? { outline: '2px solid crimson', backgroundColor: 'rgba(220,20,60,0.1)' }
                : {}),
          }}
        >
          {label(second)}
        </button>
      </div>

      {hasChosen && correctOption !== null && (
        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
          {userChoice === correctOption ? (
            <>Correct!</>
          ) : (
            <>Incorrect. It was &ldquo;{label(correctOption)}&rdquo;.</>
          )}
        </p>
      )}

      <button
        type="button"
        onClick={onNext}
        style={{ marginTop: '1rem' }}
      >
        Next
      </button>
    </section>
  );
}

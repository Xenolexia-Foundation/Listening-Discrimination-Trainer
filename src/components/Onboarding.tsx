export interface OnboardingProps {
  onDismiss: () => void;
}

export function Onboarding({ onDismiss }: OnboardingProps) {
  return (
    <div
      style={{
        marginTop: '0.5rem',
        padding: '0.75rem 1rem',
        background: '#e8f4fc',
        borderRadius: 8,
        border: '1px solid #b8d4e8',
      }}
    >
      <p style={{ margin: 0 }}>
        You&apos;ll hear one of two options. Choose which one you heard. Use &ldquo;Play again&rdquo; to replay.
        Shortcuts: <kbd style={{ padding: '1px 4px', background: '#ddd', borderRadius: 3 }}>Space</kbd> play,{' '}
        <kbd style={{ padding: '1px 4px', background: '#ddd', borderRadius: 3 }}>1</kbd>/<kbd style={{ padding: '1px 4px', background: '#ddd', borderRadius: 3 }}>2</kbd> choose.
      </p>
      <button type="button" onClick={onDismiss} style={{ marginTop: '0.5rem' }}>
        Got it
      </button>
    </div>
  );
}

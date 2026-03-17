/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stats } from './Stats';
import type { Round } from '../types/minimal-pairs';

describe('Stats', () => {
  it('shows 0/0 when no rounds', () => {
    render(<Stats rounds={[]} />);
    expect(screen.getByText(/Score: 0\/0 — 0%/)).toBeInTheDocument();
  });

  it('shows score and accuracy when rounds present', () => {
    const rounds: Round[] = [
      { pairId: '1', correctOption: 'A', userChoice: 'A', correct: true },
      { pairId: '2', correctOption: 'B', userChoice: 'A', correct: false },
    ];
    render(<Stats rounds={rounds} />);
    expect(screen.getByText(/Score: 1\/2 — 50%/)).toBeInTheDocument();
  });

  it('calls onReset when Reset session clicked', () => {
    const onReset = vi.fn();
    render(<Stats rounds={[]} onReset={onReset} />);
    fireEvent.click(screen.getByRole('button', { name: /Reset session/ }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

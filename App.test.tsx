import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import App from './App';

// Mock ProfileView to spy on renders
const renderCountSpy = vi.fn();

vi.mock('./components/ProfileView', async () => {
  const actual = await vi.importActual('./components/ProfileView');
  const React = await import('react');
  // @ts-ignore
  const ActualComponent = actual.default;

  const SpiedComponent = (props: any) => {
    renderCountSpy(props);
    return <ActualComponent {...props} />;
  };

  return {
    ...actual,
    default: React.memo(SpiedComponent),
  };
});

// Mock dependencies
vi.mock('./services/geminiService', () => ({
  GeminiService: class {
    prepareAthletePlate = vi.fn().mockResolvedValue('mock-plate');
    performJerseySwap = vi.fn().mockResolvedValue('mock-result');
    generatePlayerStats = vi.fn().mockResolvedValue({});
  }
}));

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe('App Performance Optimization', () => {
  it('should avoid re-rendering ProfileView when unrelated state changes', async () => {
    vi.useFakeTimers();

    render(<App />);

    // 1. Initial Render - Auth Screen
    const profileButton = screen.getByText('KYLE SMITH');
    fireEvent.click(profileButton);

    // 2. Handle Login Delay
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // 3. Navigate to Profile
    const profileNavButton = screen.getByLabelText('Profile');
    fireEvent.click(profileNavButton);

    // Verify ProfileView is mounted (getByText throws if not found)
    screen.getByText('KYLE SMITH');

    // Clear render count from setup phase
    renderCountSpy.mockClear();

    // 4. Trigger unrelated state update (AI Lab toggle)
    const aiLabButton = screen.getByLabelText('AI Lab');
    await act(async () => {
      fireEvent.click(aiLabButton);
    });

    // Check renders
    expect(renderCountSpy).toHaveBeenCalledTimes(0);

    vi.useRealTimers();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('App', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText('Vite + React + Hono + Cloudflare')).toBeInTheDocument();
  });

  it('increments counter when button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /increment/i });
    expect(button).toHaveTextContent('count is 0');

    await user.click(button);
    expect(button).toHaveTextContent('count is 1');
  });

  it('fetches name from API when button is clicked', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'Test Name' }),
    });

    render(<App />);

    const apiButton = screen.getByRole('button', { name: /get name/i });
    expect(apiButton).toHaveTextContent('Name from API is: unknown');

    await user.click(apiButton);

    await waitFor(() => {
      expect(apiButton).toHaveTextContent('Name from API is: Test Name');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/');
  });

  it('renders all logo links', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /vite logo/i })).toHaveAttribute(
      'href',
      'https://vite.dev',
    );
    expect(screen.getByRole('link', { name: /react logo/i })).toHaveAttribute(
      'href',
      'https://react.dev',
    );
    expect(screen.getByRole('link', { name: /hono logo/i })).toHaveAttribute(
      'href',
      'https://hono.dev/',
    );
    expect(screen.getByRole('link', { name: /cloudflare logo/i })).toHaveAttribute(
      'href',
      'https://workers.cloudflare.com/',
    );
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { NavbarLayout } from './NavbarLayout';

// Mock react-i18next translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'connexion': 'Connexion',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock the authentication store hook
vi.mock('../context/AuthStore', () => ({
  default: vi.fn((selector) => selector({
    isAuthenticated: false,
    user: null,
    logout: vi.fn(),
  })),
}));

// Mock API hook for conversations
vi.mock('../hooks/apiHooks', () => ({
  useConversations: () => ({
    data: [],
    refetch: vi.fn(),
  }),
}));

// Mock dark mode hook
vi.mock('../hooks/useDarkMode', () => ({
  useDarkMode: () => ({
    isDark: false,
    toggleTheme: vi.fn(),
  }),
}));

describe('NavbarLayout Component', () => {
  it('renders logo link and connection button when unauthenticated', () => {
    render(
      <MemoryRouter>
        <NavbarLayout />
      </MemoryRouter>
    );

    // Verify returning to home logo link is present (via aria-label)
    const logoLink = screen.getByLabelText("Retour à l'accueil");
    expect(logoLink).toBeInTheDocument();

    // Verify login link is present (rendered from the "connexion" key mock translation)
    const loginLink = screen.getByText('Connexion');
    expect(loginLink).toBeInTheDocument();
  });
});

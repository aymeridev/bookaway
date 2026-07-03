import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavbarLayout } from './NavbarLayout';

// Mock react-i18next translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'connexion': 'Connexion',
        'header.reservations': 'Reservations',
        'header.accommodation': 'Accommodation',
        'header.messaging': 'Messaging',
      };
      return translations[key] || key;
    },
  }),
}));

// Mutable state for the mock store
let mockIsAuthenticated = false;

// Mock the authentication store hook
vi.mock('../context/AuthStore', () => ({
  default: vi.fn((selector) => selector({
    isAuthenticated: mockIsAuthenticated,
    user: mockIsAuthenticated ? { id: '123' } : null,
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
  beforeEach(() => {
    mockIsAuthenticated = false;
  });

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

  it('renders menu items and toggles mobile menu when authenticated', () => {
    mockIsAuthenticated = true;
    render(
      <MemoryRouter>
        <NavbarLayout />
      </MemoryRouter>
    );

    // Check desktop menu links are in document (even if hidden by CSS, jsdom renders them)
    const reservationsLinks = screen.getAllByText('Reservations');
    expect(reservationsLinks.length).toBeGreaterThan(0);

    // Mobile menu button should be present
    const toggleButton = screen.getByLabelText('Toggle menu');
    expect(toggleButton).toBeInTheDocument();

    // Mobile navigation links should not be visible/present under the mobile dropdown initially
    // Since isMobileMenuOpen is false, the mobile dropdown div shouldn't exist.
    // Let's verify by checking if the dropdown items are not rendered or if there's only the desktop version.
    // The desktop version renders 1 link. If the mobile menu opens, it should render another link.
    expect(screen.getAllByText('Reservations').length).toBe(1);

    // Click the toggle button
    fireEvent.click(toggleButton);

    // Now there should be 2 'Reservations' links in DOM (one for desktop, one for mobile menu)
    expect(screen.getAllByText('Reservations').length).toBe(2);

    // Click toggle button again to close
    fireEvent.click(toggleButton);
    expect(screen.getAllByText('Reservations').length).toBe(1);
  });
});

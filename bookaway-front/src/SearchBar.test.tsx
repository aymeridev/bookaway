import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SearchBar } from './components/search_bar/SearchBar';
import api from './api/axios';

// Mock react-day-picker to avoid render issues during tests
vi.mock('react-day-picker', () => ({
    DayPicker: () => <div data-testid="day-picker" />,
}));

// Mock react-i18next translation hook
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: any) => {
            const translations: Record<string, string> = {
                'search-bar.destination-placeholder': 'Rechercher une destination',
                'search-bar.travelers-label': 'Voyageurs',
                'search-bar.dates-label': 'Dates',
                'search-bar.search-btn': 'Rechercher',
                'search-bar.suggestions-title': 'Destinations suggérées',
            };
            let val = translations[key] || key;
            if (options && options.value) {
                val = val.replace('{{value}}', options.value);
            }
            return val;
        },
        i18n: {
            language: 'fr',
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock the API axios client
vi.mock('./api/axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

describe('SearchBar Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.mocked(api.get).mockClear();
        vi.mocked(api.get).mockImplementation(() =>
            Promise.resolve({
                data: [
                    {
                        place_id: 1,
                        name: 'Paris',
                        display_name: 'Paris, France',
                        lat: '48.8566',
                        lon: '2.3522',
                    },
                    {
                        place_id: 2,
                        name: 'Marseille',
                        display_name: 'Marseille, France',
                        lat: '43.2965',
                        lon: '5.3698',
                    },
                ],
            })
        );
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renders the search inputs correctly', () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('Rechercher une destination')).toBeInTheDocument();
        expect(screen.getByText('Voyageurs')).toBeInTheDocument();
        expect(screen.getByText('Dates')).toBeInTheDocument();
    });

    it('performs debounced search and shows results', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('Rechercher une destination');
        fireEvent.change(input, { target: { value: 'Par' } });

        // API shouldn't be called immediately due to debounce
        expect(api.get).not.toHaveBeenCalled();

        // Advance timers by 250ms and resolve fetch promises
        await act(async () => {
            await vi.advanceTimersByTimeAsync(250);
        });

        // Results should appear
        expect(api.get).toHaveBeenCalledTimes(1);
        expect(api.get).toHaveBeenCalledWith('/geocode', expect.objectContaining({
            params: { q: 'Par' }
        }));
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText('Marseille')).toBeInTheDocument();
    });

    it('caches search queries and does not refetch', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('Rechercher une destination');

        // Search "Par"
        fireEvent.change(input, { target: { value: 'Par' } });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(250);
        });
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(api.get).toHaveBeenCalledTimes(1);

        // Clear input to close and click outside to close the dropdown
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.mouseDown(document.body);
        await act(async () => {
            await vi.advanceTimersByTimeAsync(250);
        });
        expect(screen.queryByText('Paris')).not.toBeInTheDocument();

        // Search "Par" again
        fireEvent.change(input, { target: { value: 'Par' } });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(250);
        });
        expect(screen.getByText('Paris')).toBeInTheDocument();

        // API should still only be called once because it was cached in React!
        expect(api.get).toHaveBeenCalledTimes(1);
    });

    it('allows keyboard navigation and selection', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('Rechercher une destination');
        fireEvent.change(input, { target: { value: 'Par' } });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(250);
        });

        expect(screen.getByText('Paris')).toBeInTheDocument();

        // Press ArrowDown to focus Paris (index 0)
        fireEvent.keyDown(input, { key: 'ArrowDown' });
        // Press ArrowDown to focus Marseille (index 1)
        fireEvent.keyDown(input, { key: 'ArrowDown' });

        // Marseille should have active state styling (bg-base-300)
        const marseilleButton = screen.getByText('Marseille').closest('button');
        expect(marseilleButton).toHaveClass('bg-base-300');

        // Press Enter to select Marseille
        fireEvent.keyDown(input, { key: 'Enter' });

        // Input value should be set to selected city
        expect(input).toHaveValue('Marseille (200km)');
        // List should close
        expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    });

    it('closes results when Escape is pressed or on click outside', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('Rechercher une destination');
        fireEvent.change(input, { target: { value: 'Par' } });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(250);
        });

        expect(screen.getByText('Paris')).toBeInTheDocument();

        // Press Escape
        fireEvent.keyDown(input, { key: 'Escape' });
        expect(screen.queryByText('Paris')).not.toBeInTheDocument();

        // Focus again to open list
        fireEvent.focus(input);
        expect(screen.getByText('Paris')).toBeInTheDocument();

        // Click outside
        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    });
});

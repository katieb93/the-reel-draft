import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Scoring from './scoring';
import { useLocation } from 'react-router-dom';
import useGenreIds from './useGenreIds';
import domtoimage from 'dom-to-image-more';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(),
}));

jest.mock('./useGenreIds');
jest.mock('dom-to-image-more');

describe('Scoring Component', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Use fake timers to control setTimeout
        // Mock useLocation to return necessary state data
        useLocation.mockReturnValue({
            state: {
                year: 2024,
                playersSelectedMovies: {
                    'Player 1': [{ genreGroup: 'Drama', movieTitle: 'Movie 1' }],
                    'Player 2': [{ genreGroup: 'Comedy', movieTitle: 'Movie 2' }]
                },
                genreData: { 'Drama': {}, 'Comedy': {} },
                players: [
                    { name: 'Player 1', color: '#ff0000' },
                    { name: 'Player 2', color: '#0000ff' }
                ],
                fetchedMovies: {
                    'Drama': {
                        movies: [
                            { title: 'Movie 1', ranks: { byPopularity: 10, byVoteCount: 8, byVoteAverage: 7, byRevenue: 9 } }
                        ]
                    },
                    'Comedy': {
                        movies: [
                            { title: 'Movie 2', ranks: { byPopularity: 5, byVoteCount: 6, byVoteAverage: 7, byRevenue: 8 } }
                        ]
                    }
                }
            }
        });

        // Mock useGenreIds to return test genre IDs
        useGenreIds.mockReturnValue([18, 35]);
    });

    afterEach(() => {
        jest.runOnlyPendingTimers(); // Ensure all timers have run
        jest.useRealTimers(); // Restore real timers after each test
        jest.clearAllMocks(); // Clear all mocks to avoid interference between tests
    });

    test('renders the loading screen initially', () => {
        render(<Scoring />);
        expect(screen.getByAltText('Your GIF')).toBeInTheDocument(); // Checks if the loading GIF is displayed
    });

    test('renders player boards after loading', async () => {
        render(<Scoring />);
        
        // Fast-forward the timer to hide loading screen
        act(() => {
            jest.advanceTimersByTime(10000); 
        });

        await waitFor(() => expect(screen.getByText('Player 1')).toBeInTheDocument());
        expect(screen.getByText('Player 2')).toBeInTheDocument();
    });

    test('calculates player rankings correctly', async () => {
        render(<Scoring />);
        
        act(() => {
            jest.advanceTimersByTime(10000); 
        });

        await waitFor(() => expect(screen.getByText('Winner')).toBeInTheDocument()); // Player 1 should be the winner
    });

    test('handles the share button click', async () => {
        domtoimage.toBlob.mockResolvedValue(new Blob()); // Mock the dom-to-image function

        render(<Scoring />);
        
        act(() => {
            jest.advanceTimersByTime(10000); 
        });

        const shareButton = screen.getByText('Share your results!');
        fireEvent.click(shareButton);

        await waitFor(() => expect(screen.getByText('Copied to keyboard')).toBeInTheDocument()); // Popup message should appear
    });

    test('creates snapshot correctly', async () => {
        const mockBlob = new Blob();
        domtoimage.toBlob.mockResolvedValue(mockBlob); // Mock the dom-to-image function

        render(<Scoring />);
        
        act(() => {
            jest.advanceTimersByTime(10000); 
        });

        const shareButton = screen.getByText('Share your results!');
        fireEvent.click(shareButton);

        await waitFor(() => {
            expect(domtoimage.toBlob).toHaveBeenCalled(); // Ensure snapshot creation was triggered
        });
    });
});

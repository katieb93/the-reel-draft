import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';
import './SavedScoresLegacy.css';

const SavedScoresLegacy = () => {
    const [scores, setScores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                // Get the current authenticated user
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                const user = session.user;

                if (!user || !user.id) {
                    setError("User not authenticated.");
                    return;
                }

                const curUser = user.id;

                const { data: scoresSession, error: scoresSessionError } = await supabase
                    .from('game_sessions')
                    .select('id')
                    .eq('user_id', curUser); // Filter by the current user's ID
            
                if (scoresSessionError) {
                    console.error("Error fetching scores:", scoresSessionError);
                } else {
                    console.log("Fetched Scores:", scoresSession);
                }

                // Extract the game_session_ids from the scoresSession array
                const gameSessionIds = scoresSession.map(session => session.id);

                const { data: scores, error } = await supabase
                    .from('player_movie_choices')
                    .select('*')
                    .in('game_session_id', gameSessionIds); // Filter by the game_session_id

                if (error) {
                    console.error("Error fetching player movie choices:", error);
                } else {
                    console.log("Fetched Player Movie Choices:", scores);
                }

                // Group scores by game_session_id
                const groupedScores = scores.reduce((acc, score) => {
                    const gameId = score.game_session_id;
                
                    if (!acc[gameId]) {
                        acc[gameId] = {
                            userId: score.game_session_id,
                            createdAt: score.created_at,
                            draftYear: score.draft_year, // Add draft_year to the group
                            scores: []
                        };
                    }
                
                    acc[gameId].scores.push(score);
                    return acc;
                }, {});
                
                console.log("GLOO", groupedScores);
                setScores(groupedScores);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchScores();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="whole-saved">
            <h2>Your Scores</h2>
            <div className="all-players"> {/* Apply the styles */}
                {Object.keys(scores).map((gameId) => {
                    const gameSession = scores[gameId];
                    const { createdAt, draftYear, scores: gameSessionScores } = gameSession;

                    // Format the createdAt date
                    const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    // Get unique genres
                    const genres = [...new Set(gameSessionScores.map(score => score.genre_name))];

                    // Get unique players
                    const players = [...new Set(gameSessionScores.map(score => score.player_name))];

                    return (
                        <div  key={gameId} style={{ marginBottom: '20px' }}>
                            <h4>{draftYear} Film Draft (Played on {formattedDate})</h4>  {/* Display the draft year and played date */}
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {players.map((player, playerIndex) => (
                                                <th key={playerIndex}>{player}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {genres.map((genre, genreIndex) => (
                                            <tr key={genreIndex}>
                                                <td className="genre-column">{genre}</td>
                                                {players.map((player, playerIndex) => (
                                                    <td key={playerIndex} style={{ backgroundColor: gameSessionScores.find(score => score.player_name === player && score.genre_name === genre)?.player_color || 'transparent' }}>
                                                        {gameSessionScores.find(score => score.player_name === player && score.genre_name === genre)?.movie_title || '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SavedScoresLegacy;

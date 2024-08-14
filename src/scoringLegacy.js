
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './scoringLegacy.css';
import 'animate.css';
import domtoimage from 'dom-to-image-more';
import reelLogo from './blackReelLogo.svg';
import MovieTableLegacy from './MovieTableLegacy.js';
import colorGif from './colorGif.gif';
import { supabase } from './supabaseClient.js';

const ScoringLegacy = () => {
    const rankWords = {
        1: 'Winner',
        2: 'Second Place',
        3: 'Third Place',
        4: 'Fourth Place',
        5: 'Fifth Place',
        6: 'Sixth Place',
        7: 'Seventh Place',
        8: 'Eighth Place',
        9: 'Ninth Place',
        10: 'Tenth Place',
    };

    const location = useLocation();
    const selected = location.state.playersSelectedMovies;
    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);
    const genreData = location.state.genreData;
    const numberOfGenres = Object.keys(genreData).length;
    const players = location.state.players;
    const year = location.state.year;
    const fetchedMovies = location.state.fetchedMovies;

    const [isVisible, setIsVisible] = useState(false);
    const [isLoadVisible, setIsLoadVisible] = useState(true);
    const [isScoreVisible, setIsScoreVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [choicesInserted, setChoicesInserted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoadVisible(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const getColorWithOpacity = (color) => {
        color = color.substring(1);
        const red = parseInt(color.substring(0, 2), 16);
        const green = parseInt(color.substring(2, 4), 16);
        const blue = parseInt(color.substring(4, 6), 16);
        return `rgba(${red}, ${green}, ${blue}, 0.2)`;
    };

    const getPlayerStyle = useCallback((playerName) => {
        const player = players.find(player => player.name === playerName);
        return player ? {
            '--player-color': player.color,
            '--player-color-opacity': getColorWithOpacity(player.color)
        } : {};
    }, [players]);

    const insertPlayerChoices = useCallback(async (gameSessionId) => {
        try {
            const { data: existingChoices, error: fetchError } = await supabase
                .from('player_movie_choices')
                .select('id')
                .eq('game_session_id', gameSessionId);

            if (fetchError) {
                console.error("GLASS An error occurred while fetching existing choices:", fetchError.message);
                throw fetchError;
            }

            if (existingChoices && existingChoices.length > 0) {
                setChoicesInserted(true);
                return;
            } else {
                console.log(`GLASS Game session ID ${gameSessionId} does not exist in player_movie_choices. Proceeding with insertion.`);
            }

            const playerChoices = Object.keys(selected).map(playerName => {
                const playerMovies = selected[playerName];
                return playerMovies.map(movie => ({
                    game_session_id: gameSessionId,
                    player_name: playerName,
                    genre_name: sanitizeGenre(movie.genreGroup),
                    movie_title: movie.movieTitle,
                    draft_year: year,
                    player_color: getPlayerStyle(playerName)['--player-color']
                }));
            }).flat();

            const { error } = await supabase
                .from('player_movie_choices')
                .insert(playerChoices);

            if (error) {
                throw error;
            }

            setChoicesInserted(true);

        } catch (error) {
            console.error("Error saving player choices:", error.message);
            setError(error.message);
        }
    }, [selected, year, getPlayerStyle]);

    useEffect(() => {
        if (!isLoadVisible) {
            setIsScoreVisible(true);
            if (!choicesInserted) {
                insertPlayerChoices(gameId);
            }
        }
    }, [isLoadVisible, choicesInserted, gameId, insertPlayerChoices]);

    const handleSeeScores = () => {
        window.location.href = '/SavedScoresLegacy';
    };

    const handlePlayAgain = () => {
        window.location.href = '/dataGatherLegacy';
    };

    const sortMoviesByGenre = (movies) => {
        const genreOrder = Object.keys(genreData);
        return movies.sort((a, b) => genreOrder.indexOf(a.genreGroup) - genreOrder.indexOf(b.genreGroup));
    };

    const findMovieRank = (selected) => {
        const movieRanks = {};
        for (const playerName in selected) {
            const playerMovies = selected[playerName];
            movieRanks[playerName] = {};

            for (const movie of playerMovies) {
                let genreGroup = movie.genreGroup.replace(' / ', '_');
                const movieTitle = movie.movieTitle;
                let fetchedGenreGroup = genreGroup.replace(' / ', '_');

                if (fetchedMovies[fetchedGenreGroup]) {
                    const genreMovies = fetchedMovies[fetchedGenreGroup];
                    const matchedMovie = genreMovies.movies.find(movie => movie.title === movieTitle);

                    if (matchedMovie) {
                        if (!movieRanks[playerName][genreGroup]) {
                            movieRanks[playerName][genreGroup] = [];
                        }
                        movieRanks[playerName][genreGroup].push(matchedMovie);
                    }
                }
            }
        }
        return movieRanks;
    };

    const extractMovieRanks = (data) => {
        const result = {};
        for (const character in data) {
            result[character] = {};
            for (const genre in data[character]) {
                result[character][genre] = data[character][genre].map(movie => ({
                    title: movie.title,
                    movieRankNum: movie.ranks
                }));
            }
        }
        return result;
    };

    const calculateAverage = (movieRankNum) => {
        const { byPopularity, byVoteCount, byVoteAverage, byRevenue } = movieRankNum;
        const sum = byPopularity + byVoteCount + byVoteAverage + byRevenue;
        return sum / 4;
    };

    const calculateAverages = (extractedRanks) => {
        const averages = {};
        for (const character in extractedRanks) {
            averages[character] = {};
            for (const genre in extractedRanks[character]) {
                averages[character][genre] = extractedRanks[character][genre].map(movie => ({
                    title: movie.title,
                    average: calculateAverage(movie.movieRankNum)
                }));
            }
        }
        return averages;
    };



    const calculatePlayerAverages = (movieAverages) => {
        const playerAverages = {};
        Object.entries(movieAverages).forEach(([player, genres]) => {
            let sum = 0;
            let count = 0;
    
            const calculateSumAndCount = (movie) => {
                sum += movie.average;
                count++;
            };
    
            for (const genre in genres) {
                genres[genre].forEach(calculateSumAndCount);
            }
    
            if (count < numberOfGenres) {
                const remainingGenres = numberOfGenres - count;
                sum += remainingGenres * 0;
            }
    
            const average = numberOfGenres === 0 ? 0 : sum / numberOfGenres;
            playerAverages[player] = average;
        });
        return playerAverages;
    };
    

    const rankPlayers = (playerAverages) => {
        const sortedPlayers = Object.entries(playerAverages).sort((a, b) => b[1] - a[1]);
        const rankedPlayers = {};
        sortedPlayers.forEach(([player, _], index) => {
            const rank = index + 1;
            const rankWord = rankWords[rank] || `${rank}th Place`;
            rankedPlayers[player] = { rank, rankWord };
        });
        return rankedPlayers;
    };

    useEffect(() => {
        const fetchGameSession = async () => {
            try {
                let { data: game_sessions, error } = await supabase
                    .from('game_sessions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(1);

                console.log("BLANK SPACE Game Sessions:", game_sessions);

                if (error) {
                    throw error;
                }

                if (game_sessions && game_sessions.length > 0) {
                    setGameId(game_sessions[0].id);
                }
            } catch (error) {
                setError(error.message);
            }
        };
        fetchGameSession();
    }, []);

    const movieRanks = findMovieRank(selected);
    const extractedRanks = extractMovieRanks(movieRanks);
    const movieAverages = calculateAverages(extractedRanks);
    const playerAverages = calculatePlayerAverages(movieAverages);
    const rankedPlayers = rankPlayers(playerAverages);

    const areAverageRanksAvailable = Object.values(playerAverages).every(rank => !isNaN(rank) && rank !== Infinity);
    if (!areAverageRanksAvailable) {
        return null;
    }

    const sortedPlayers = Object.keys(selected).sort((a, b) => rankedPlayers[a].rank - rankedPlayers[b].rank);

    const isNotFirefox = navigator.userAgent.indexOf("Firefox") < 0;

    const copyImageToClipBoardOtherBrowsers = () => {
        if (isNotFirefox) {
            navigator?.permissions
                ?.query({ name: "clipboard-write" })
                .then(async (result) => {
                    if (result.state === "granted") {
                        const type = "image/png";
                        const blob = await snapshotCreator();
                        let data = [new ClipboardItem({ [type]: blob })];
                        navigator.clipboard
                            .write(data)
                            .then(() => {})
                            .catch((err) => {
                                console.error("Error:", err);
                            });
                    }
                });
        } else {
            alert("Firefox does not support this functionality");
        }
    };

    const snapshotCreator = () => {
        return new Promise((resolve, reject) => {
            try {
                const scale = 2;
                const element = document.getElementById('my-draft');
                const scaledWidth = element.offsetWidth * scale;
                const scaledHeight = element.offsetHeight * scale;

                domtoimage
                    .toBlob(element, {
                        height: scaledHeight,
                        width: scaledWidth,
                        style: {
                            transform: "scale(" + scale + ")",
                            transformOrigin: "top left",
                            width: scaledWidth + "px",
                            height: scaledHeight + "px",
                        },
                        filter: node => node.className !== 'copied-button'
                    })
                    .then((blob) => {
                        resolve(blob);
                    });
            } catch (e) {
                reject(e);
            }
        });
    };

    const shareClick = () => {
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 2000);
        copyImageToClipBoardOtherBrowsers();
    };

    const sanitizeGenre = (genre) => {
        return genre.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    };

    const handleShareClick = () => {
        setIsVisible(true);
    };

    const closeContainer = () => {
        setIsVisible(false);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='all'>
            {isLoadVisible && (
                <div className='score-load'>
                    <div className='score-load-container'>
                        <img className="gif-image" src={colorGif} alt="Your GIF" />
                    </div>
                </div>
            )}
            {isScoreVisible && (
                <div className='button-include'>
                    <div className="score-record">
                        <button className="initiate-share play-again" onClick={handlePlayAgain}>
                            Play again
                        </button>
                        <button className="initiate-share" onClick={handleShareClick}>
                            Share your results!
                        </button>
                        <button className="initiate-share play-again" onClick={handleSeeScores}>
                            See all scores
                        </button>
                    </div>
                    <div className="all-players">
                        {sortedPlayers.map((playerName, index) => {
                            const { rankWord } = rankedPlayers[playerName];
                            const playerStyle = getPlayerStyle(playerName);
                            const animationDelay = (sortedPlayers.length - index - 1) * 1 + 's';
                            const animationDuration = sortedPlayers.length * 0.5 + 's';

                            return (
                                <div 
                                    key={playerName} 
                                    className={`player-section animate__animated animate__fadeInLeft animate`}
                                    style={{ 
                                        ...playerStyle, 
                                        animationDelay,
                                        animationDuration
                                    }}
                                >
                                    <h2 className="player-header">{playerName}</h2>
                                    <h2 className="player-header-rank">{rankWord}</h2>
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className='genre-header'>Genre</th>
                                                    <th>Movie</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortMoviesByGenre(selected[playerName]).map((movie, index) => (
                                                    <tr key={index}>
                                                        <td className='genre-column'>{movie.genreGroup}</td>
                                                        <td className='movie-titles'>{movie.movieTitle}</td>
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
            )}
            {showPopup && (
                <div className="score-pop">
                    <p className='message message-pop'>Copied to clipboard</p>
                </div>
            )}
            <div className={`copied-holder ${isVisible ? 'visible' : ''}`} style={{ display: isVisible ? 'flex' : 'none' }}>
                <div className="copied-close-button" onClick={closeContainer}>
                    &times;
                </div>
                <div className="copied-button">
                    <button onClick={shareClick}>Share!</button>
                </div>
                <div className='copied-test'>
                    <div className="copied-box" id='my-draft'>
                        <div className="copied-content">
                            <h2 className='copied-h2'>Our {year} Movie Draft</h2>
                            <div className='copied-play'>
                                <p className='copied-p'>Come play @</p>
                                <img src={reelLogo} alt="Reel Logo" />
                            </div>
                        </div>
                        <MovieTableLegacy
                            year={year}
                            gameId={gameId}
                            sortedPlayers={sortedPlayers}
                            selected={selected}
                            sanitizeGenre={sanitizeGenre}
                            getPlayerStyle={getPlayerStyle}
                            rankedPlayers={rankedPlayers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoringLegacy;

import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient.js'; // Adjust the path based on your project structure

const fetchGameSession = async (setGameId, setError) => {
  try {
    let { data: game_sessions, error } = await supabase
      .from('game_sessions')
      .select('*')
      .range(0, 0); // Adjust range as needed

    if (error) {
      throw error;
    }

    if (game_sessions && game_sessions.length > 0) {
      console.log('Fetched game_sessions:', game_sessions);
      setGameId(game_sessions[0].id); // Use 'id' which is the UUID primary key
    }
  } catch (error) {
    setError(error.message);
  }
};



const savePlayerChoices = async (year, gameSessionId, selected) => {
    const rowsToInsert = [];
  
    console.log('XX BANG BAMG:', year);
    console.log('XXgameSessionId:', gameSessionId);
    console.log('XXselected:', selected);
  
    Object.keys(selected).forEach((player) => {
      console.log('Processing player:', player);
  
      selected[player].forEach((movie) => {
        console.log('Processing movie:', movie);
        rowsToInsert.push({
          game_session_id: gameSessionId,
          player_name: movie.playerName,
          genre_name: movie.genreGroup,
          movie_title: movie.movieTitle,
          draft_year: year
        });
      });
    });
    
    console.log("BLUE MAN USER", gameSessionId)

    console.log("BLUE MAN", gameSessionId)
    try {
      // Check if player choices already exist for this game session
      const { data: existingChoices, error: fetchError } = await supabase
        .from('player_movie_choices')
        .select('*')
        .eq('game_session_id', gameSessionId);
  
      if (fetchError) {
        throw fetchError;
      }
  
      if (existingChoices.length === 0) {
        // Insert only if no existing choices found
        console.log('Inserting rows:', rowsToInsert);
        const { data, error } = await supabase
          .from('player_movie_choices')
          .insert(rowsToInsert)
          .select();
  
        if (error) {
          throw error;
        }
  
        console.log('Player choices saved successfully:', data);
      } else {
        console.log('Player choices already exist for this game session:', existingChoices);
      }
    } catch (error) {
      console.error('Error saving player choices:', error);
    }
};

const MovieTableLegacy = ({ year, sortedPlayers, selected, sanitizeGenre, getPlayerStyle, rankedPlayers }) => {
  console.log("BRING IT", year);
  const [gameId, setGameId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGameSession(setGameId, setError);
  }, []);

  useEffect(() => {
    if (gameId) {
      savePlayerChoices(year, gameId, selected);
    }
  }, [year, gameId, selected]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Object to store movie data organized by player and genre
  const tableData = {};

  console.log('sortedPlayers:', sortedPlayers);
  console.log('selected:', selected);
  console.log('rankedPlayers:', rankedPlayers);

  // Organize movie data by player and genre
  sortedPlayers.forEach((playerName) => {
    const movies = selected[playerName];
    if (movies && Array.isArray(movies)) {
      movies.forEach((movie) => {
        if (!tableData[movie.genreGroup]) {
          tableData[movie.genreGroup] = {};
        }
        if (!tableData[movie.genreGroup][playerName]) {
          tableData[movie.genreGroup][playerName] = [];
        }
        tableData[movie.genreGroup][playerName].push(movie.movieTitle);
      });
    }
  });

  console.log('tableData:', tableData);

  const genres = Object.keys(tableData);
  const players = sortedPlayers;

  // Check if the number of players is greater than 7
  const shouldSwitchLayout = players.length > 7;

  console.log('genres:', genres);
  console.log('players:', players);
  console.log('shouldSwitchLayout:', shouldSwitchLayout);

  // Generate table rows
  const rows = shouldSwitchLayout
    ? players.map((playerName) => {
        const cells = genres.map((genre) => {
          const sanitizedGenre = sanitizeGenre(genre);
          const movies = tableData[genre][playerName] || [];
          return (
            <td key={`${sanitizedGenre}-${playerName}`} className={`player-cell genre ${sanitizedGenre}`} style={getPlayerStyle(playerName)}>
              {movies.join(', ')}
            </td>
          );
        });

        const { rankWord } = rankedPlayers[playerName];
        return (
          <tr key={playerName}>
            <td className="player-column" style={getPlayerStyle(playerName)}>
              <div>{playerName}</div>
              <div className="rank-word">{rankWord}</div>
            </td>
            {cells}
          </tr>
        );
      })
    : genres.map((genre) => {
        const sanitizedGenre = sanitizeGenre(genre);
        const cells = players.map((playerName) => {
          const movies = tableData[genre][playerName] || [];
          return (
            <td key={`${sanitizedGenre}-${playerName}`} className={`player-cell ${sanitizedGenre}`} style={getPlayerStyle(playerName)}>
              {movies.join(', ')}
            </td>
          );
        });

        return (
          <tr key={genre}>
            <td className={`genre-column ${sanitizedGenre}`} style={{ backgroundColor: 'black', color: 'white' }}>
              {genre}
            </td>
            {cells}
          </tr>
        );
      });

  console.log('rows:', rows);

  // Generate table
  return (
    <div className="back-wrap">
      <table className="copied-table">
        {shouldSwitchLayout ? (
          <thead className="thead-row genre-define">
            <tr>
              <th className="copied-black-cell"></th>
              {genres.map((genre) => {
                const sanitizedGenre = sanitizeGenre(genre);
                return (
                  <th key={sanitizedGenre} className={sanitizedGenre} style={{ backgroundColor: 'black', color: 'white' }}>
                    {genre}
                  </th>
                );
              })}
            </tr>
          </thead>
        ) : (
          <thead className="thead-row">
            <tr>
              <th className="copied-black-cell"></th>
              {players.map((playerName) => (
                <th key={playerName} style={getPlayerStyle(playerName)}>
                  <div>{playerName}</div>
                  <div className="rank-word">{rankedPlayers[playerName].rankWord}</div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default MovieTableLegacy;

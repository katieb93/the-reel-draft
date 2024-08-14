import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import DataGather from './dataGather';
import PlayersInOrder from './playersInOrder';

import PlayersInOrderLegacy from './playersInOrderLegacy';

import ListOfMovies from './getListofMovies';
import ListOfMoviesLegacy from './getListofMoviesLegacy';

import GameOptions from './gameOptions';
import NavBar from './navBar';
import FooterNavBar from './footer';
import AuthComponentLegacy from './authComponentLegacy';

import Account from './Account'; // Import the Account component


// import LegacyGameStart from './legacyGameStart';
// import EnterGameCode from './EnterGameCode';


import Scoring from './scoring';
import ScoringLegacy from './scoringLegacy';

import './App.css'; // Import CSS file for global styles
import 'animate.css/animate.min.css'; // Import Animate.css
import DataGatherLegacy from './dataGatherLegacy';

import SavedScoresLegacy from './SavedScoresLegacy';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gameOptions" element={<GameOptions />} />
          <Route path="/authComponentLegacy" element={<AuthComponentLegacy />} />
          {/* <Route path="/legacyGameStart" element={<LegacyGameStart />} />
          <Route path="/EnterGameCode" element={<EnterGameCode />} /> */}

          <Route path="/dataGather" element={<DataGather />} />
          <Route path="/dataGatherLegacy" element={<DataGatherLegacy />} />

          <Route path="/playersInOrder" element={<PlayersInOrder />} />
          <Route path="/playersInOrderLegacy" element={<PlayersInOrderLegacy />} />


          <Route path="/getListofMovies" element={<ListOfMovies />} />
          <Route path="/getListofMoviesLegacy" element={<ListOfMoviesLegacy />} />

          <Route path="/SavedScoresLegacy" element={<SavedScoresLegacy />} />

          <Route path="/account" element={<Account />} /> {/* Add the Account route */}


          <Route path="/scoring" element={<Scoring />} />
          <Route path="/scoringLegacy" element={<ScoringLegacy />} />


        </Routes>
      </div>
      <FooterNavBar />
    </Router>
  );
}

export default App;
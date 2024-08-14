import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.js';
import DataGather from './dataGather.js';
import PlayersInOrder from './playersInOrder.js';

import PlayersInOrderLegacy from './playersInOrderLegacy.js';

import ListOfMovies from './getListofMovies.js';
import ListOfMoviesLegacy from './getListofMoviesLegacy.js';

import GameOptions from './gameOptions.js';
import NavBar from './navBar.js';
import FooterNavBar from './footer.js';
import AuthComponentLegacy from './authComponentLegacy.js';



// import LegacyGameStart from './legacyGameStart';
// import EnterGameCode from './EnterGameCode';


import Scoring from './scoring.js';
import ScoringLegacy from './scoringLegacy.js';

import './App.css'; // Import CSS file for global styles
import 'animate.css/animate.min.css'; // Import Animate.css
import DataGatherLegacy from './dataGatherLegacy.js';

import SavedScoresLegacy from './SavedScoresLegacy.js';

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



          <Route path="/scoring" element={<Scoring />} />
          <Route path="/scoringLegacy" element={<ScoringLegacy />} />


        </Routes>
      </div>
      <FooterNavBar />
    </Router>
  );
}

export default App;
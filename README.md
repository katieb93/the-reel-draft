# **The Reel Draft**

## **Introduction**

This project is a React-based web application that provides a variety of functionalities, including user authentication, data gathering, and movie data retrieval from an external API. It also features legacy components that demonstrate alternative implementations of the same features. The project includes different game modes for users to engage with, such as a quick draft or legacy draft.

## **Table of Contents**

- [**The Reel Draft**](#the-reel-draft)
  - [**Introduction**](#introduction)
  - [**Table of Contents**](#table-of-contents)
  - [**Installation**](#installation)
  - [**Features**](#features)
  - [**Dependencies**](#dependencies)
  - [**Configuration**](#configuration)
  - [**Documentation**](#documentation)
    - [**Components Overview**](#components-overview)
  - [**Styling**](#styling)
  - [**Troubleshooting**](#troubleshooting)
  - [**Contributors**](#contributors)
 

## **Installation**


**Navigate to the project directory.**


cd yourprojectname

**Install the necessary dependencies using npm or yarn.**


npm install **or** yarn install

**Usage to start the application, run:**


npm start
This will launch the application in your default web browser. You can navigate through the app using the provided routes.


## **Features**

- **User Authentication:** Sign-up and login features with profile management.
- **Data Gathering:** Form-based data collection and navigation.
- **Movie Data Retrieval:** Integration with The Movie Database (TMDb) API to fetch movie data based on user-selected criteria.
- **Game Modes:** Choose between quick draft (no login required) and legacy draft (login required) game modes.
- **Movie Selection and Ranking:** Allows players to select movies and rank them based on various criteria.
- **Player Management:** Components for collecting and displaying player names, as well as organizing them into a draft order.
- **Video Tutorials:** Embedded video player for tutorials on how to play the game.
- **Legacy Components:** Demonstrates different approaches to the same functionality for educational or fallback purposes.
- **Scoring and History:** Displays scoring based on movie selections and retrieves past scores for review.

## **Dependencies**

- **React:** JavaScript library for building user interfaces.
- **React Router DOM:** For routing within the application.
- **Supabase:** Used for backend authentication and database operations.
- **Axios:** For making HTTP requests to external APIs.
- **ReactPlayer:** For embedding and controlling video playback in the application.
- **dom-to-image-more:** For generating images of DOM elements, particularly used in the scoring component.
- **Jest:** For running tests and ensuring component correctness.

## **Configuration**

Ensure that the following environment variables are set:

- `REACT_APP_TMDB_API_KEY`: Your API key for TMDb.
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY`: Your Supabase public API key.

## **Documentation**

### **Components Overview**

- **Account:** Handles user account settings and profile updates.
- **AuthComponentLegacy:** A legacy component that provides user authentication and game session creation.
- **DataGather & DataGatherLegacy:** Components for collecting player data and handling form submissions.
- **GameOptions:** Allows users to select between different game modes.
- **EnterGameCode:** Provides functionality to enter a game code and join an existing game session.
- **ListOfMovies & ListOfMoviesLegacy:** Fetch and display movies based on selected genres, allowing players to make their picks.
- **MovieTable & MovieTableLegacy:** Displays the selected movies for each player in a table format.
- **LogoComponent:** Displays the logo and title of the application.
- **NavBar:** Navigation bar that includes user session management (login/logout).
- **PlayerBoard & PlayerBoardLegacy:** Displays player boards for selecting movies, showing current selections, and indicating player turns.
- **PlayerNames:** Collects and displays player names.
- **PlayersInOrder & PlayersInOrderLegacy:** Organizes and displays players in the draft order.
- **Home:** The landing page of the application that welcomes users and provides navigation options.
- **LegacyGameStart:** Displays the game ID and allows users to start a legacy draft game.
- **SavedScoresLegacy:** Retrieves and displays the scores from past game sessions.
- **Scoring & ScoringLegacy:** Displays the scoring of the current draft based on movie selections and calculates rankings.
- **SetupTests:** Configuration for Jest testing environment.
- **ReportWebVitals:** Utility for reporting web vitals to improve performance.
- **VideoPlayer:** Plays embedded tutorial videos explaining how to use the application.
- **SupabaseClient:** Handles connection to the Supabase backend.
- **UseGenreIds:** Custom hook for mapping genres to their respective IDs.

## **Styling**

The application uses various CSS files to style components. Key styles include layout adjustments, form styling, button designs, and more. For instance:

- **EnterGameCode.css:** Styles the interface for entering a game code.
- **GameOptions.css:** Styles the game options selection interface.
- **Home.css:** Styles the homepage layout and elements.
- **LegacyGameStart.css:** Styles the legacy game start screen.
- **ListOfMovies.css:** Styles the list of movies and player boards.
- **NavBar.css:** Styles the navigation bar.
- **PlayerBoard.css:** Styles the player boards for selecting and displaying movies.
- **PlayersInOrder.css & PlayersInOrderLegacy.css:** Styles the player draft order lists.
- **SavedScoresLegacy.css:** Styles the saved scores display.
- **Scoring.css & ScoringLegacy.css:** Styles the scoring displays and related components.
- **Video.css:** Styles the video player component.



## **Troubleshooting**

- **API Key Issues:**  
  Ensure your TMDb API key is correctly set in the environment variables.

- **Routing Problems:**  
  Verify that all routes are correctly defined in `App.js`.

- **Session Management:**  
  If users are not being logged in or out correctly, check the Supabase session handling in `NavBar.js`.

- **Video Playback Issues:**  
  Ensure the video file path is correct and accessible, and that the `ReactPlayer` component is properly configured.

- **Testing Issues:**  
  Ensure that Jest is configured correctly by reviewing `setupTests.js`.

## **Contributors**

- **Katie Elizabeth Brown**  - Initial work



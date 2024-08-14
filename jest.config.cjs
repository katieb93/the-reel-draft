// // /Users/katiebrown/reel-draft-site/jest.config.js

// module.exports = {
//     transform: {
//       "^.+\\.[t|j]sx?$": "babel-jest"
//     },
//     transformIgnorePatterns: [
//       "/node_modules/(?!axios)",  
//       "\\.pnp\\.[^\\/]+$"
//     ],
//     testEnvironment: "jsdom",
//     moduleFileExtensions: ["js", "jsx", "json", "node"],
//     setupFilesAfterEnv: ["@testing-library/jest-dom"],
//     testPathIgnorePatterns: [
//       "/node_modules/",
//       "/build/",
//       "src/fetchMovies.js",
//       "src/getListofMovies.js",
//       "src/playerBoard.js",
//       "src/playersInOrder.js",
//       "src/scoring.js"
//     ],
//   };
  

// jest.config.js
module.exports = {
  // Other Jest configurations...
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/jest.mock.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
};
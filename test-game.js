// Automated Test Harness for Bollywood-Hollywood Game Engine

const fs = require('fs');
const path = require('path');

// Mock browser objects
global.window = global;
global.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; }
};

// Load dependencies
require('./js/movies-data.js');
require('./js/storage.js');
require('./js/game.js');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log("=== RUNNING BOLLYWOOD-HOLLYWOOD GAME ENGINE TESTS ===");

// 1. Movie Database Integrity
console.log("\n1. Testing Movie Database Integrity...");
assert(window.MOVIE_DATABASE.bollywood.length >= 20, "Bollywood has at least 20 levels covered");
assert(window.MOVIE_DATABASE.hollywood.length >= 20, "Hollywood has at least 20 levels covered");

for (let lvl = 1; lvl <= 20; lvl++) {
  const bMovies = window.MOVIE_DATABASE.bollywood.filter(m => m.level === lvl);
  assert(bMovies.length >= 1, `Bollywood has movie for Level ${lvl} (${bMovies.map(m=>m.title).join(', ')})`);
  const hMovies = window.MOVIE_DATABASE.hollywood.filter(m => m.level === lvl);
  assert(hMovies.length >= 1, `Hollywood has movie for Level ${lvl} (${hMovies.map(m=>m.title).join(', ')})`);
}

// 2. Game Mechanics & Striking Word
console.log("\n2. Testing Game Mechanics & Word Striking...");
const game = new window.BollywoodHollywoodGame({ mode: "bollywood" });
game.startNewGame("bollywood");

assert(game.currentLevel === 1, "Game starts at level 1");
assert(game.getStrikingWord() === "BOLLYWOOD", "Bollywood mode strikes BOLLYWOOD");
assert(game.maxMistakes === 9, "Striking word has 9 letters (9 mistakes allowed)");

const strikesInitial = game.getStrikingLettersState();
assert(strikesInitial.length === 9, "Striking letters array length is 9");
assert(strikesInitial.every(s => !s.isStruck), "No letters struck initially");

// 3. Incorrect Guess Striking
console.log("\n3. Testing Incorrect Guess & Strikes Count...");
// Pick a letter definitely not in the movie or test with random letter
const title = game.currentMovie.title.toUpperCase();
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const absentLetter = alphabet.find(ch => !title.includes(ch));

assert(absentLetter !== undefined, `Found absent letter '${absentLetter}'`);
const guessResult = game.guessLetter(absentLetter);
assert(guessResult === false, "Incorrect guess returns false");
assert(game.mistakesCount === 1, "Mistakes count incremented to 1");

const strikesAfterOneWrong = game.getStrikingLettersState();
assert(strikesAfterOneWrong[0].isStruck === true, "First letter of BOLLYWOOD is struck");
assert(strikesAfterOneWrong[1].isStruck === false, "Second letter of BOLLYWOOD is not yet struck");

// 4. Scoring Calculation Rule
console.log("\n4. Testing Scoring Rules...");
// Rule:
// 1. For every guessed movie you get 10 points
// 2. For every unused guess you get 1 point
// With 1 mistake made, unused guesses = 9 - 1 = 8.
// Expected level score: 10 + 8 = 18 points.

// Guess all letters in title
for (let ch of title) {
  if (/^[A-Z]$/.test(ch)) {
    game.guessLetter(ch);
  }
}

assert(game.status === "level_won", "Status becomes level_won after all letters guessed");
assert(game.levelScore === 18, `Level score equals 18 (10 base + 8 unused guesses), got ${game.levelScore}`);
assert(game.totalScore === 18, `Total score is 18, got ${game.totalScore}`);

// 5. Level Reset Verification
console.log("\n5. Testing Level Guesses Reset...");
game.nextLevel();
assert(game.currentLevel === 2, "Advanced to Level 2");
assert(game.mistakesCount === 0, "Mistakes count resets to 0 for new level");
assert(game.guessedLetters.size === 0, "Guessed letters cleared for new level");
const strikesLevel2 = game.getStrikingLettersState();
assert(strikesLevel2.every(s => !s.isStruck), "Marquee letters restored to unstruck state for new level");

// 6. Test Hollywood Striking Word
console.log("\n6. Testing Hollywood Mode...");
const hwGame = new window.BollywoodHollywoodGame({ mode: "hollywood" });
hwGame.startNewGame("hollywood");
assert(hwGame.getStrikingWord() === "HOLLYWOOD", "Hollywood mode strikes HOLLYWOOD");

// 7. Test Game Over on 9 mistakes
console.log("\n7. Testing Game Over on 9 Strikes...");
const goGame = new window.BollywoodHollywoodGame({ mode: "bollywood" });
goGame.startNewGame("bollywood");
const goTitle = goGame.currentMovie.title.toUpperCase();
const missingLetters = alphabet.filter(ch => !goTitle.includes(ch));
assert(missingLetters.length >= 9, "Enough missing letters for testing 9 strikes");

for (let i = 0; i < 9; i++) {
  goGame.guessLetter(missingLetters[i]);
}

assert(goGame.mistakesCount === 9, "Mistakes reached 9");
assert(goGame.status === "game_over", "Game status is game_over");

// 8. Test 20-Level Victory Progression
console.log("\n8. Testing 20-Level Victory Progression...");
const vicGame = new window.BollywoodHollywoodGame({ mode: "bollywood" });
vicGame.startNewGame("bollywood");

for (let lvl = 1; lvl <= 20; lvl++) {
  const currentTitle = vicGame.currentMovie.title.toUpperCase();
  for (let ch of currentTitle) {
    if (/^[A-Z]$/.test(ch)) {
      vicGame.guessLetter(ch);
    }
  }
  if (lvl < 20) {
    assert(vicGame.status === "level_won", `Level ${lvl} won`);
    vicGame.nextLevel();
  }
}

assert(vicGame.status === "game_won", "Completing level 20 sets status to game_won");
// With 0 mistakes in every level, each level gave 10 + 9 = 19 points. 20 levels * 19 = 380 points!
assert(vicGame.totalScore === 380, `Perfect 20-level score is 380 points, got ${vicGame.totalScore}`);

// 9. Storage & Leaderboard Verification
console.log("\n9. Testing Storage & Leaderboard...");
const profile = window.storageManager.loadProfile();
assert(profile.cumulativePoints > 0, "Cumulative points saved in profile");
const leaderboard = window.storageManager.getRankedLeaderboard("cumulative");
assert(leaderboard.length > 0, "Leaderboard populated with rankings");
const playerEntry = leaderboard.find(p => p.isPlayer === true);
assert(playerEntry !== undefined, "Player is listed in the leaderboard");
assert(playerEntry.cumulative === profile.cumulativePoints, "Player cumulative score matches leaderboard");

console.log(`\n========================================`);
console.log(`ALL TESTS COMPLETED: ${passedTests} / ${totalTests} PASSED!`);
console.log(`========================================\n`);

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

// Mock fetch for tests
global.fetch = async () => ({
  ok: true,
  json: async () => ({ leaderboard: [] })
});

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

// 8. Test 20-Level Victory & Golden Ticket Award (Requirement 5)
console.log("\n8. Testing 20-Level Victory & Golden Ticket...");
const initialGolden = window.storageManager.profile.goldenTickets || 0;
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
    vicGame.nextLevel();
  }
}

assert(vicGame.status === "game_won", "Completing level 20 sets status to game_won");
assert(vicGame.totalScore === 380, `Perfect 20-level score is 380 points, got ${vicGame.totalScore}`);
assert(window.storageManager.profile.goldenTickets === initialGolden + 1, "Awarded 1 Golden Movie Ticket on Level 20 win");

// 9. Test Challenge Friends Mode (5 Movies) & Purple Ticket Award (Requirement 4)
console.log("\n9. Testing Challenge Friends Mode & Purple Ticket...");
const initialPurple = window.storageManager.profile.purpleTickets || 0;
const challengeSeed = "FILMI99";
const chGame1 = new window.BollywoodHollywoodGame();
chGame1.startChallengeGame(challengeSeed, null, null);

assert(chGame1.gameType === "challenge", "Game type is challenge");
assert(chGame1.maxLevels === 5, "Challenge mode has exactly 5 levels");

// Collect titles for seed FILMI99
const seedTitles1 = [];
for (let lvl = 1; lvl <= 5; lvl++) {
  seedTitles1.push(chGame1.currentMovie.title);
  const curT = chGame1.currentMovie.title.toUpperCase();
  for (let ch of curT) {
    if (/^[A-Z]$/.test(ch)) chGame1.guessLetter(ch);
  }
  if (lvl < 5) chGame1.nextLevel();
}

assert(chGame1.status === "challenge_won", "Challenge won after 5 levels");
assert(seedTitles1.length === 5, "Played exactly 5 movies");

// Second player playing the exact same seed
const chGame2 = new window.BollywoodHollywoodGame();
chGame2.startChallengeGame(challengeSeed, "Challenger1", 85);
const seedTitles2 = [];
for (let lvl = 1; lvl <= 5; lvl++) {
  seedTitles2.push(chGame2.currentMovie.title);
  const curT = chGame2.currentMovie.title.toUpperCase();
  for (let ch of curT) {
    if (/^[A-Z]$/.test(ch)) chGame2.guessLetter(ch);
  }
  if (lvl < 5) chGame2.nextLevel();
}

assert(JSON.stringify(seedTitles1) === JSON.stringify(seedTitles2), "Both players received the exact same 5 movies in Challenge Mode");
assert(window.storageManager.profile.purpleTickets > initialPurple, "Awarded Purple Movie Ticket on Challenge win");

// 10. Storage & Name Capture Verification (Requirement 1 & 2)
console.log("\n10. Testing Storage, Name Capture & Cloud DB...");
assert(window.storageManager.isPlayerNameSet() === false, "isPlayerNameSet initially false for fresh profile");
window.storageManager.setPlayerName("Karan_Johar", "🍿");
assert(window.storageManager.isPlayerNameSet() === true, "isPlayerNameSet true after setting name");
assert(window.storageManager.profile.name === "Karan_Johar", "Player name saved correctly");
assert(window.storageManager.profile.avatar === "🍿", "Avatar saved correctly");

const rankedBoard = window.storageManager.getRankedLeaderboard("tickets");
assert(rankedBoard.length > 0, "Leaderboard ranked by tickets available");
const playerEntry = rankedBoard.find(p => p.isPlayer === true);
assert(playerEntry !== undefined, "Player listed in tickets leaderboard");

console.log(`\n========================================`);
console.log(`ALL TESTS COMPLETED: ${passedTests} / ${totalTests} PASSED!`);
console.log(`========================================\n`);

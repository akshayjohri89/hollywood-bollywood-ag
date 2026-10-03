/**
 * Bollywood-Hollywood Game Engine
 * Implements core Hangman-style movie guessing, 20-level classic progression,
 * 5-level Challenge Friends mode, BOLLYWOOD / HOLLYWOOD letter striking,
 * and Golden & Purple Movie Ticket rewards.
 */

class BollywoodHollywoodGame {
  constructor(options = {}) {
    this.mode = options.mode || "mixed"; // 'bollywood', 'hollywood', 'mixed'
    this.gameType = "classic"; // 'classic' (20 levels) or 'challenge' (5 levels)
    this.isDaily = !!options.isDaily;
    this.currentLevel = 1;
    this.maxLevels = 20;
    this.totalScore = 0;
    this.currentMovie = null;
    this.revealedLetters = new Set();
    this.guessedLetters = new Set();
    this.mistakesCount = 0;
    this.maxMistakes = 9; // BOLLYWOOD / HOLLYWOOD has 9 letters
    this.status = "idle"; // 'idle', 'playing', 'level_won', 'game_won', 'challenge_won', 'game_over'
    this.levelScore = 0;
    this.moviesPlayedThisSession = new Set();

    // Challenge Mode metadata
    this.challengeSeed = null;
    this.challengerName = null;
    this.challengerScore = null;

    // Callbacks
    this.onUpdate = options.onUpdate || (() => {});
    this.onLetterResult = options.onLetterResult || (() => {});
    this.onLevelComplete = options.onLevelComplete || (() => {});
    this.onGameOver = options.onGameOver || (() => {});
    this.onVictory = options.onVictory || (() => {});
    this.onChallengeComplete = options.onChallengeComplete || (() => {});
  }

  // Start new 20-level Classic/Daily run
  startNewGame(mode = null, isDaily = false) {
    this.gameType = "classic";
    if (mode) this.mode = mode;
    this.isDaily = isDaily;
    this.currentLevel = 1;
    this.maxLevels = 20;
    this.totalScore = 0;
    this.status = "playing";
    this.moviesPlayedThisSession.clear();
    this.challengeSeed = null;
    this.challengerName = null;
    this.challengerScore = null;

    this.setupLevel(this.currentLevel);

    if (typeof window !== "undefined" && window.va) {
      window.va('event', { name: 'game_start', type: 'classic' });
    }
  }

  // Start 5-Level "Challenge Friends" run
  startChallengeGame(seed = null, challengerName = null, challengerScore = null) {
    this.gameType = "challenge";
    this.currentLevel = 1;
    this.maxLevels = 5; // Exactly 5 movies for friend challenge
    this.totalScore = 0;
    this.status = "playing";
    this.moviesPlayedThisSession.clear();

    // Generate or use seed
    this.challengeSeed = seed ? String(seed).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase();
    this.challengerName = challengerName ? String(challengerName).trim() : null;
    this.challengerScore = (challengerScore !== null && challengerScore !== undefined && !isNaN(challengerScore)) 
      ? Number(challengerScore) 
      : null;

    this.setupLevel(this.currentLevel);

    if (typeof window !== "undefined" && window.va) {
      window.va('event', { name: 'game_start', type: 'challenge', seed: this.challengeSeed });
    }
  }

  // Setup specific level
  setupLevel(levelNumber) {
    this.currentLevel = levelNumber;
    this.mistakesCount = 0;
    this.guessedLetters.clear();
    this.revealedLetters.clear();
    this.levelScore = 0;
    this.status = "playing";

    // Select movie for current level
    this.currentMovie = this.pickMovieForLevel(levelNumber);

    // Auto-reveal non-alphabet characters (spaces, hyphens, punctuation, digits)
    const title = this.currentMovie.title.toUpperCase();
    for (let char of title) {
      if (!/^[A-Z]$/.test(char)) {
        this.revealedLetters.add(char);
      }
    }

    this.notifyUpdate();
  }

  // Pick appropriate movie based on level & mode
  pickMovieForLevel(level) {
    const db = window.MOVIE_DATABASE;

    // Challenge Mode (5 movies): Deterministically picked using challengeSeed
    if (this.gameType === "challenge") {
      let seedSum = 0;
      const seedStr = this.challengeSeed || "CHALLENGE";
      for (let i = 0; i < seedStr.length; i++) {
        seedSum += seedStr.charCodeAt(i) * (i + 7);
      }

      // Alternate categories: Level 1 Bollywood, Level 2 Hollywood, Level 3 Bollywood...
      const cat = (level % 2 === 1) ? "bollywood" : "hollywood";
      // Map 5 levels to graduated difficulties (1->2, 2->4, 3->6, 4->8, 5->10)
      const targetDiff = Math.min(20, level * 2);
      let candidates = db[cat].filter(m => Math.abs(m.level - targetDiff) <= 2);
      if (!candidates || candidates.length === 0) candidates = db[cat];

      const idx = (seedSum + level * 13) % candidates.length;
      const chosen = candidates[idx];
      this.moviesPlayedThisSession.add(chosen.title);
      return { ...chosen, category: cat };
    }

    // Classic / Daily Mode (20 levels)
    let category = "bollywood";
    if (this.mode === "hollywood") {
      category = "hollywood";
    } else if (this.mode === "mixed") {
      if (this.isDaily) {
        category = (level % 2 === 1) ? "bollywood" : "hollywood";
      } else {
        category = Math.random() < 0.5 ? "bollywood" : "hollywood";
      }
    }

    // Filter by level
    let candidates = db[category].filter(m => m.level === level);
    if (!candidates || candidates.length === 0) {
      candidates = db[category].filter(m => Math.abs(m.level - level) <= 2);
    }

    let available = candidates.filter(m => !this.moviesPlayedThisSession.has(m.title));
    if (available.length === 0) available = candidates;

    let selected;
    if (this.isDaily) {
      const today = new Date().toISOString().slice(0, 10);
      let seed = 0;
      for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i) * (i + 1);
      const index = (seed + level) % available.length;
      selected = available[index];
    } else {
      const index = Math.floor(Math.random() * available.length);
      selected = available[index];
    }

    this.moviesPlayedThisSession.add(selected.title);
    return {
      ...selected,
      category: category
    };
  }

  // Handle letter guess
  guessLetter(char) {
    if (this.status !== "playing") return false;

    const letter = char.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return false;
    if (this.guessedLetters.has(letter)) return false;

    this.guessedLetters.add(letter);
    const title = this.currentMovie.title.toUpperCase();

    if (title.includes(letter)) {
      // Correct guess
      this.revealedLetters.add(letter);
      if (window.soundEngine) window.soundEngine.playCorrect();
      this.onLetterResult({ letter, isCorrect: true });

      if (this.isWordGuessed()) {
        this.handleLevelWin();
      } else {
        this.notifyUpdate();
      }
      return true;
    } else {
      // Incorrect guess
      this.mistakesCount += 1;
      if (window.soundEngine) window.soundEngine.playStrike();
      this.onLetterResult({ letter, isCorrect: false, strikeIndex: this.mistakesCount - 1 });

      if (this.mistakesCount >= this.maxMistakes) {
        this.handleLevelLoss();
      } else {
        this.notifyUpdate();
      }
      return false;
    }
  }

  isWordGuessed() {
    if (!this.currentMovie) return false;
    const title = this.currentMovie.title.toUpperCase();
    for (let char of title) {
      if (!this.revealedLetters.has(char)) {
        return false;
      }
    }
    return true;
  }

  // Handle Level Victory
  handleLevelWin() {
    this.status = "level_won";

    // Scoring Rules:
    // 1. +10 points for guessing the movie
    // 2. +1 point for every unused guess
    const unusedGuesses = Math.max(0, this.maxMistakes - this.mistakesCount);
    const moviePoints = 10;
    const unusedPoints = unusedGuesses * 1;
    this.levelScore = moviePoints + unusedPoints;
    this.totalScore += this.levelScore;

    // Persist to cumulative score in storage
    if (window.storageManager) {
      window.storageManager.recordLevelVictory(this.levelScore, this.currentLevel, this.isDaily);
    }

    // Check if entire run is completed!
    if (this.currentLevel >= this.maxLevels) {
      if (this.gameType === "challenge") {
        // === 5-LEVEL CHALLENGE FRIENDS COMPLETED ===
        this.status = "challenge_won";
        let wonChallenge = true;

        if (this.challengerScore !== null) {
          wonChallenge = this.totalScore >= this.challengerScore;
        }

        // Award Purple Movie Ticket if won!
        let totalPurpleTickets = 0;
        if (wonChallenge && window.storageManager) {
          totalPurpleTickets = window.storageManager.awardPurpleTicket();
        } else if (window.storageManager) {
          totalPurpleTickets = window.storageManager.profile.purpleTickets || 0;
        }

        if (window.soundEngine) window.soundEngine.playGrandVictory();
        if (typeof window !== "undefined" && window.va) {
          window.va('event', { name: 'challenge_complete', won: wonChallenge, score: this.totalScore });
        }

        this.onChallengeComplete({
          wonChallenge: wonChallenge,
          finalScore: this.totalScore,
          challengerScore: this.challengerScore,
          challengerName: this.challengerName,
          challengeSeed: this.challengeSeed,
          purpleTickets: totalPurpleTickets,
          levelScore: this.levelScore,
          unusedGuesses: unusedGuesses,
          movie: this.currentMovie
        });
      } else {
        // === 20-LEVEL CLASSIC GAME WON (GOLDEN TICKET!) ===
        this.status = "game_won";
        let totalGoldenTickets = 0;
        if (window.storageManager) {
          window.storageManager.recordGameFinished(this.totalScore, true);
          totalGoldenTickets = window.storageManager.awardGoldenTicket();
        }

        if (window.soundEngine) window.soundEngine.playGrandVictory();
        if (typeof window !== "undefined" && window.va) {
          window.va('event', { name: 'game_won', finalScore: this.totalScore, goldenTickets: totalGoldenTickets });
        }

        this.onVictory({
          finalScore: this.totalScore,
          levelScore: this.levelScore,
          unusedGuesses: unusedGuesses,
          goldenTickets: totalGoldenTickets,
          movie: this.currentMovie
        });
      }
    } else {
      // Single Level cleared
      if (window.soundEngine) window.soundEngine.playLevelComplete();
      if (typeof window !== "undefined" && window.va) {
        window.va('event', { name: 'level_won', level: this.currentLevel, score: this.levelScore });
      }

      this.onLevelComplete({
        level: this.currentLevel,
        maxLevels: this.maxLevels,
        levelScore: this.levelScore,
        moviePoints: moviePoints,
        unusedGuesses: unusedGuesses,
        unusedPoints: unusedPoints,
        totalScore: this.totalScore,
        movie: this.currentMovie,
        nextLevel: this.currentLevel + 1,
        gameType: this.gameType,
        challengerScore: this.challengerScore,
        challengerName: this.challengerName
      });
    }

    this.notifyUpdate();
  }

  // Handle Level Loss (All 9 strikes used)
  handleLevelLoss() {
    this.status = "game_over";
    if (window.soundEngine) window.soundEngine.playGameOver();

    if (window.storageManager) {
      window.storageManager.recordGameFinished(this.totalScore, false);
    }

    if (typeof window !== "undefined" && window.va) {
      window.va('event', { name: 'game_over', levelReached: this.currentLevel, totalScore: this.totalScore });
    }

    this.onGameOver({
      level: this.currentLevel,
      maxLevels: this.maxLevels,
      totalScore: this.totalScore,
      movie: this.currentMovie,
      gameType: this.gameType,
      challengerScore: this.challengerScore,
      challengerName: this.challengerName,
      challengeSeed: this.challengeSeed
    });

    this.notifyUpdate();
  }

  nextLevel() {
    if (this.currentLevel < this.maxLevels) {
      this.setupLevel(this.currentLevel + 1);
    }
  }

  retryLevel() {
    this.setupLevel(this.currentLevel);
  }

  getStrikingWord() {
    if (!this.currentMovie) return "BOLLYWOOD";
    return this.currentMovie.category === "hollywood" ? "HOLLYWOOD" : "BOLLYWOOD";
  }

  getStrikingLettersState() {
    const word = this.getStrikingWord();
    return word.split("").map((letter, idx) => ({
      letter,
      isStruck: idx < this.mistakesCount,
      isLatestStrike: idx === this.mistakesCount - 1
    }));
  }

  getMaskedTitle() {
    if (!this.currentMovie) return [];
    const title = this.currentMovie.title.toUpperCase();

    const words = title.split(" ");
    return words.map(w => {
      return w.split("").map(char => {
        const isRevealed = this.revealedLetters.has(char);
        const isLetter = /^[A-Z]$/.test(char);
        return {
          char: isRevealed ? char : "",
          realChar: char,
          isLetter: isLetter,
          isRevealed: isRevealed
        };
      });
    });
  }

  notifyUpdate() {
    const word = this.getStrikingWord();
    const movieTitle = this.currentMovie ? this.currentMovie.title.toUpperCase() : "";
    const incorrectLetters = Array.from(this.guessedLetters).filter(ch => !movieTitle.includes(ch));

    this.onUpdate({
      level: this.currentLevel,
      maxLevels: this.maxLevels,
      totalScore: this.totalScore,
      levelScore: this.levelScore,
      mistakesCount: this.mistakesCount,
      unusedGuesses: Math.max(0, this.maxMistakes - this.mistakesCount),
      maxMistakes: this.maxMistakes,
      status: this.status,
      gameType: this.gameType,
      challengeSeed: this.challengeSeed,
      challengerName: this.challengerName,
      challengerScore: this.challengerScore,
      strikingWord: word,
      strikingLetters: this.getStrikingLettersState(),
      maskedWords: this.getMaskedTitle(),
      movieInfo: {
        category: this.currentMovie ? this.currentMovie.category : "bollywood",
        year: this.currentMovie ? this.currentMovie.year : "",
        genre: this.currentMovie ? this.currentMovie.genre : "",
        hint: this.currentMovie ? this.currentMovie.hint : ""
      },
      guessedLetters: Array.from(this.guessedLetters),
      incorrectGuesses: incorrectLetters
    });
  }
}

window.BollywoodHollywoodGame = BollywoodHollywoodGame;

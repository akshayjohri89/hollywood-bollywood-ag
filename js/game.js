/**
 * Bollywood-Hollywood Game Engine
 * Implements core Hangman-style movie guessing, 20-level progression,
 * BOLLYWOOD / HOLLYWOOD letter striking, and point calculations.
 */

class BollywoodHollywoodGame {
  constructor(options = {}) {
    this.mode = options.mode || "mixed"; // 'bollywood', 'hollywood', 'mixed'
    this.isDaily = !!options.isDaily;
    this.currentLevel = 1;
    this.maxLevels = 20;
    this.totalScore = 0;
    this.currentMovie = null;
    this.revealedLetters = new Set();
    this.guessedLetters = new Set();
    this.mistakesCount = 0;
    this.maxMistakes = 9; // BOLLYWOOD / HOLLYWOOD has 9 letters
    this.status = "idle"; // 'idle', 'playing', 'level_won', 'game_won', 'game_over'
    this.levelScore = 0;
    this.moviesPlayedThisSession = new Set();

    // Callbacks
    this.onUpdate = options.onUpdate || (() => {});
    this.onLetterResult = options.onLetterResult || (() => {});
    this.onLevelComplete = options.onLevelComplete || (() => {});
    this.onGameOver = options.onGameOver || (() => {});
    this.onVictory = options.onVictory || (() => {});
  }

  // Start new 20-level run
  startNewGame(mode = null, isDaily = false) {
    if (mode) this.mode = mode;
    this.isDaily = isDaily;
    this.currentLevel = 1;
    this.totalScore = 0;
    this.status = "playing";
    this.moviesPlayedThisSession.clear();
    this.setupLevel(this.currentLevel);

    if (typeof window !== "undefined" && window.va) {
      window.va('event', { name: 'game_start' });
    }
  }

  // Setup specific level (1-20)
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
    let pool = [];
    const db = window.MOVIE_DATABASE;

    let category = "bollywood";
    if (this.mode === "hollywood") {
      category = "hollywood";
    } else if (this.mode === "mixed") {
      // Alternate or randomize: odd levels Bollywood, even levels Hollywood, or daily seed
      if (this.isDaily) {
        category = (level % 2 === 1) ? "bollywood" : "hollywood";
      } else {
        category = Math.random() < 0.5 ? "bollywood" : "hollywood";
      }
    }

    // Filter by level (fall back to closest level if exact level not found)
    let candidates = db[category].filter(m => m.level === level);
    if (!candidates || candidates.length === 0) {
      candidates = db[category].filter(m => Math.abs(m.level - level) <= 2);
    }

    // Remove movies already played in this run
    let available = candidates.filter(m => !this.moviesPlayedThisSession.has(m.title));
    if (available.length === 0) {
      available = candidates;
    }

    // Pick selection (deterministic for daily challenge, randomized for regular play)
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
      category: category // 'bollywood' or 'hollywood'
    };
  }

  // Handle letter guess
  guessLetter(char) {
    if (this.status !== "playing") return false;

    const letter = char.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return false;
    if (this.guessedLetters.has(letter)) return false; // Already guessed

    this.guessedLetters.add(letter);
    const title = this.currentMovie.title.toUpperCase();

    if (title.includes(letter)) {
      // Correct guess!
      this.revealedLetters.add(letter);

      if (window.soundEngine) window.soundEngine.playCorrect();
      this.onLetterResult({ letter, isCorrect: true });

      // Check if word is complete
      if (this.isWordGuessed()) {
        this.handleLevelWin();
      } else {
        this.notifyUpdate();
      }
      return true;
    } else {
      // Incorrect guess! Strike a letter from BOLLYWOOD or HOLLYWOOD
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

  // Check if all letters in current title are revealed
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

    // Scoring Rules specified by user:
    // 1. For every guessed movie: 10 points
    // 2. For every unused guess: 1 point
    const unusedGuesses = Math.max(0, this.maxMistakes - this.mistakesCount);
    const moviePoints = 10;
    const unusedPoints = unusedGuesses * 1;
    this.levelScore = moviePoints + unusedPoints;
    this.totalScore += this.levelScore;

    // Persist to cumulative score in storage
    if (window.storageManager) {
      window.storageManager.recordLevelVictory(this.levelScore, this.currentLevel, this.isDaily);
    }

    if (this.currentLevel >= this.maxLevels) {
      // 20 levels completed! Grand Victory!
      this.status = "game_won";
      if (window.storageManager) {
        window.storageManager.recordGameFinished(this.totalScore, true);
      }
      if (typeof window !== "undefined" && window.va) {
        window.va('event', { name: 'game_won', finalScore: this.totalScore });
      }
      this.onVictory({
        finalScore: this.totalScore,
        levelScore: this.levelScore,
        unusedGuesses: unusedGuesses,
        movie: this.currentMovie
      });
    } else {
      // Level cleared
      if (window.soundEngine) window.soundEngine.playLevelComplete();
      if (typeof window !== "undefined" && window.va) {
        window.va('event', { name: 'level_won', level: this.currentLevel, score: this.levelScore });
      }
      this.onLevelComplete({
        level: this.currentLevel,
        levelScore: this.levelScore,
        moviePoints: moviePoints,
        unusedGuesses: unusedGuesses,
        unusedPoints: unusedPoints,
        totalScore: this.totalScore,
        movie: this.currentMovie,
        nextLevel: this.currentLevel + 1
      });
    }

    this.notifyUpdate();
  }

  // Handle Level Failure (All 9 letters struck out)
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
      totalScore: this.totalScore,
      movie: this.currentMovie
    });

    this.notifyUpdate();
  }

  // Advance to next level
  nextLevel() {
    if (this.currentLevel < this.maxLevels) {
      this.setupLevel(this.currentLevel + 1);
    }
  }

  // Retry current level (Practice)
  retryLevel() {
    this.setupLevel(this.currentLevel);
  }

  // Get striking word letters: 'BOLLYWOOD' or 'HOLLYWOOD'
  getStrikingWord() {
    if (!this.currentMovie) return "BOLLYWOOD";
    return this.currentMovie.category === "hollywood" ? "HOLLYWOOD" : "BOLLYWOOD";
  }

  // Return formatted array of letters with strike state
  getStrikingLettersState() {
    const word = this.getStrikingWord();
    return word.split("").map((letter, idx) => ({
      letter,
      isStruck: idx < this.mistakesCount,
      isLatestStrike: idx === this.mistakesCount - 1
    }));
  }

  // Get current masked title representation
  getMaskedTitle() {
    if (!this.currentMovie) return [];
    const title = this.currentMovie.title.toUpperCase();

    // Group into words for responsive wrapping
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

  // Notify UI
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

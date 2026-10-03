/**
 * Bollywood-Hollywood Main Application Controller
 * Handles UI events, input, rendering, modals, and confetti.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const headerPoints = document.getElementById("headerPoints");
  const soundBtn = document.getElementById("soundBtn");
  const soundIcon = document.getElementById("soundIcon");
  const rulesBtn = document.getElementById("rulesBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const profileBtn = document.getElementById("profileBtn");
  const profileAvatar = document.getElementById("profileAvatar");

  const hudLevelText = document.getElementById("hudLevelText");
  const hudLevelBarFill = document.getElementById("hudLevelBarFill");
  const hudStreakText = document.getElementById("hudStreakText");
  const hudScoreText = document.getElementById("hudScoreText");

  const marqueeCategoryTag = document.getElementById("marqueeCategoryTag");
  const marqueeCategoryName = document.getElementById("marqueeCategoryName");
  const marqueeGrid = document.getElementById("marqueeGrid");
  const strikesIndicator = document.getElementById("strikesIndicator");
  const unusedGuessesText = document.getElementById("unusedGuessesText");
  const incorrectLettersList = document.getElementById("incorrectLettersList");

  const movieYearTag = document.getElementById("movieYearTag");
  const movieGenreTag = document.getElementById("movieGenreTag");
  const movieTitleContainer = document.getElementById("movieTitleContainer");
  const hintContent = document.getElementById("hintContent");
  const hintToggleBtn = document.getElementById("hintToggleBtn");

  const keyboardContainer = document.getElementById("keyboardContainer");

  // Modals
  const levelWinModal = document.getElementById("levelWinModal");
  const winUnusedBreakdownLabel = document.getElementById("winUnusedBreakdownLabel");
  const winUnusedBreakdownVal = document.getElementById("winUnusedBreakdownVal");
  const winTotalBreakdownVal = document.getElementById("winTotalBreakdownVal");
  const nextLevelBtn = document.getElementById("nextLevelBtn");

  const gameOverModal = document.getElementById("gameOverModal");
  const gameOverMovieTitle = document.getElementById("gameOverMovieTitle");
  const gameOverLevel = document.getElementById("gameOverLevel");
  const gameOverScore = document.getElementById("gameOverScore");
  const retryGameBtn = document.getElementById("retryGameBtn");
  const gameOverLeaderboardBtn = document.getElementById("gameOverLeaderboardBtn");

  const victoryModal = document.getElementById("victoryModal");
  const victoryFinalScore = document.getElementById("victoryFinalScore");
  const victoryCumulativeScore = document.getElementById("victoryCumulativeScore");
  const victoryRestartBtn = document.getElementById("victoryRestartBtn");
  const victoryLeaderboardBtn = document.getElementById("victoryLeaderboardBtn");

  const leaderboardModal = document.getElementById("leaderboardModal");
  const lbTabCumulative = document.getElementById("lbTabCumulative");
  const lbTabDaily = document.getElementById("lbTabDaily");
  const leaderboardList = document.getElementById("leaderboardList");
  const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");

  const profileModal = document.getElementById("profileModal");
  const profileModalAvatar = document.getElementById("profileModalAvatar");
  const playerNameInput = document.getElementById("playerNameInput");
  const profileCumulativeVal = document.getElementById("profileCumulativeVal");
  const profileStreakVal = document.getElementById("profileStreakVal");
  const profileMaxLevelVal = document.getElementById("profileMaxLevelVal");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const closeProfileBtn = document.getElementById("closeProfileBtn");
  const avatarOptions = document.querySelectorAll(".avatar-option");

  const rulesModal = document.getElementById("rulesModal");
  const closeRulesBtn = document.getElementById("closeRulesBtn");

  // State
  let selectedAvatar = "🎬";
  let currentLeaderboardTab = "cumulative";
  let isHintRevealed = false;

  // QWERTY keyboard layout
  const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  // Helper: Get difficulty title from level
  function getDifficultyLabel(level) {
    if (level <= 5) return "Novice Blockbuster";
    if (level <= 10) return "Rising Cinephile";
    if (level <= 15) return "Cult Film Buff";
    return "Cinema Maestro (Expert)";
  }

  // --- Initialize Game Engine ---
  const game = new BollywoodHollywoodGame({
    mode: "mixed",
    onUpdate: renderGameState,
    onLevelComplete: handleLevelWon,
    onGameOver: handleGameOver,
    onVictory: handleGameVictory
  });

  // --- Render Functions ---
  function renderGameState(state) {
    // Top HUD
    hudLevelText.textContent = `${String(state.level).padStart(2, '0')} / ${state.maxLevels}`;
    const progressPercent = Math.min(100, Math.round((state.level / state.maxLevels) * 100));
    hudLevelBarFill.style.width = `${progressPercent}%`;
    hudScoreText.textContent = `${state.totalScore}`;

    const profile = window.storageManager ? window.storageManager.profile : null;
    if (profile) {
      hudStreakText.textContent = `🔥 ${profile.dailyStreak} Day${profile.dailyStreak > 1 ? 's' : ''}`;
      headerPoints.textContent = `${profile.cumulativePoints} Pts`;
      profileAvatar.textContent = profile.avatar || "🎬";
    }

    // Category Marquee Tag
    const isBollywood = state.movieInfo.category === "bollywood";
    marqueeCategoryTag.style.borderColor = isBollywood ? "rgba(255, 183, 3, 0.4)" : "rgba(0, 210, 255, 0.4)";
    marqueeCategoryName.textContent = isBollywood ? "BOLLYWOOD" : "HOLLYWOOD";

    // Marquee Word Letters Grid (BOLLYWOOD / HOLLYWOOD)
    marqueeGrid.innerHTML = "";
    state.strikingLetters.forEach(item => {
      const card = document.createElement("div");
      card.className = "marquee-letter-card";
      if (item.isStruck) card.classList.add("struck");
      if (item.isLatestStrike) card.classList.add("latest-strike");
      card.textContent = item.letter;
      marqueeGrid.appendChild(card);
    });

    // Strike Indicators (9 pips)
    strikesIndicator.innerHTML = "";
    for (let i = 0; i < state.maxMistakes; i++) {
      const pip = document.createElement("div");
      pip.className = "strike-pip";
      if (i < state.mistakesCount) pip.classList.add("used");
      strikesIndicator.appendChild(pip);
    }

    // Unused Guesses & Points Bonus
    unusedGuessesText.innerHTML = `Safe: <strong>${state.unusedGuesses} / ${state.maxMistakes}</strong> (+${state.unusedGuesses} pts)`;

    // Incorrect Guesses List (displays letters guessed incorrectly)
    if (incorrectLettersList) {
      incorrectLettersList.innerHTML = "";
      if (!state.incorrectGuesses || state.incorrectGuesses.length === 0) {
        incorrectLettersList.innerHTML = '<span class="no-wrong-text">None</span>';
      } else {
        state.incorrectGuesses.forEach(letter => {
          const chip = document.createElement("span");
          chip.className = "incorrect-chip";
          chip.textContent = letter;
          incorrectLettersList.appendChild(chip);
        });
      }
    }

    // Movie Details (difficulty hidden per request)
    movieYearTag.textContent = `📅 Year: ${state.movieInfo.year || "Classic"}`;
    movieGenreTag.textContent = `🎭 Genre: ${state.movieInfo.genre || "Drama"}`;

    // Hint Reset/Display (Kept in code, hidden in CSS)
    if (isHintRevealed) {
      hintContent.textContent = `💡 Clue: "${state.movieInfo.hint}"`;
      hintToggleBtn.textContent = "Clue Revealed";
      hintToggleBtn.disabled = true;
    } else {
      hintContent.textContent = "💡 Need a clue? Unlock director / dialogue hint!";
      hintToggleBtn.textContent = "Show Clue";
      hintToggleBtn.disabled = false;
    }

    // Movie Title Tiles
    renderMovieTitle(state.maskedWords);

    // Virtual Keyboard
    renderKeyboard(state.guessedLetters);
  }

  function renderMovieTitle(words) {
    movieTitleContainer.innerHTML = "";
    words.forEach(wordGroup => {
      const wordDiv = document.createElement("div");
      wordDiv.className = "movie-word";

      wordGroup.forEach(slot => {
        const slotDiv = document.createElement("div");
        slotDiv.className = "letter-slot";

        if (slot.isLetter) {
          if (slot.isRevealed) {
            slotDiv.classList.add("revealed");
            slotDiv.textContent = slot.char;
          } else {
            slotDiv.textContent = "";
          }
        } else {
          // Special char / punctuation / number
          slotDiv.classList.add("special-char");
          slotDiv.textContent = slot.char;
        }

        wordDiv.appendChild(slotDiv);
      });

      movieTitleContainer.appendChild(wordDiv);
    });
  }

  function renderKeyboard(guessedLetters) {
    keyboardContainer.innerHTML = "";
    const guessedSet = new Set(guessedLetters);
    const movieTitle = game.currentMovie ? game.currentMovie.title.toUpperCase() : "";

    KEYBOARD_ROWS.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "kb-row";

      row.forEach(keyChar => {
        const keyBtn = document.createElement("button");
        keyBtn.className = "kb-key";
        keyBtn.textContent = keyChar;
        keyBtn.setAttribute("data-letter", keyChar);

        if (guessedSet.has(keyChar)) {
          keyBtn.disabled = true;
          if (movieTitle.includes(keyChar)) {
            keyBtn.classList.add("correct");
          } else {
            keyBtn.classList.add("wrong");
          }
        }

        keyBtn.addEventListener("click", () => {
          handleInputLetter(keyChar);
        });

        rowDiv.appendChild(keyBtn);
      });

      keyboardContainer.appendChild(rowDiv);
    });
  }

  // --- Input Handling ---
  function handleInputLetter(char) {
    if (isAnyModalOpen()) return;
    if (window.soundEngine) window.soundEngine.init();
    game.guessLetter(char);
  }

  // Physical Keyboard Listener
  window.addEventListener("keydown", (e) => {
    if (isAnyModalOpen()) {
      if (e.key === "Enter" || e.key === " ") {
        if (levelWinModal.classList.contains("active")) {
          nextLevelBtn.click();
          e.preventDefault();
        } else if (gameOverModal.classList.contains("active")) {
          retryGameBtn.click();
          e.preventDefault();
        }
      }
      return;
    }

    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      handleInputLetter(key);
    }
  });

  // --- Hint System ---
  hintToggleBtn.addEventListener("click", () => {
    if (!isHintRevealed) {
      isHintRevealed = true;
      if (window.soundEngine) window.soundEngine.playHint();
      hintContent.textContent = `💡 Clue: "${game.currentMovie.hint}"`;
      hintToggleBtn.textContent = "Clue Revealed";
      hintToggleBtn.disabled = true;
    }
  });

  // --- Modal Logic ---
  function handleLevelWon(data) {
    isHintRevealed = false;
    winUnusedBreakdownLabel.textContent = `Unused Guesses (${data.unusedGuesses} remaining)`;
    winUnusedBreakdownVal.textContent = `+${data.unusedPoints} Pts`;
    winTotalBreakdownVal.textContent = `+${data.levelScore} Pts`;

    levelWinModal.classList.add("active");
  }

  nextLevelBtn.addEventListener("click", () => {
    levelWinModal.classList.remove("active");
    game.nextLevel();
  });

  function handleGameOver(data) {
    isHintRevealed = false;
    gameOverMovieTitle.textContent = data.movie ? data.movie.title : "Unknown Movie";
    gameOverLevel.textContent = `Level ${data.level} / 20`;
    gameOverScore.textContent = `${data.totalScore} Pts`;
    gameOverModal.classList.add("active");
  }

  retryGameBtn.addEventListener("click", () => {
    gameOverModal.classList.remove("active");
    game.startNewGame(game.mode, game.isDaily);
  });

  gameOverLeaderboardBtn.addEventListener("click", () => {
    gameOverModal.classList.remove("active");
    openLeaderboard();
  });

  function handleGameVictory(data) {
    isHintRevealed = false;
    victoryFinalScore.textContent = `${data.finalScore} Pts`;
    victoryCumulativeScore.textContent = `+${data.finalScore} Pts to Career`;
    victoryModal.classList.add("active");
    startConfetti();
  }

  victoryRestartBtn.addEventListener("click", () => {
    victoryModal.classList.remove("active");
    stopConfetti();
    game.startNewGame(game.mode, game.isDaily);
  });

  victoryLeaderboardBtn.addEventListener("click", () => {
    victoryModal.classList.remove("active");
    stopConfetti();
    openLeaderboard();
  });

  function isAnyModalOpen() {
    return document.querySelector(".modal-overlay.active") !== null;
  }

  // --- Leaderboard Modal ---
  function openLeaderboard() {
    renderLeaderboardList(currentLeaderboardTab);
    leaderboardModal.classList.add("active");
  }

  leaderboardBtn.addEventListener("click", openLeaderboard);
  closeLeaderboardBtn.addEventListener("click", () => {
    leaderboardModal.classList.remove("active");
  });

  lbTabCumulative.addEventListener("click", () => {
    currentLeaderboardTab = "cumulative";
    lbTabCumulative.classList.add("active");
    lbTabDaily.classList.remove("active");
    renderLeaderboardList("cumulative");
  });

  lbTabDaily.addEventListener("click", () => {
    currentLeaderboardTab = "daily";
    lbTabDaily.classList.add("active");
    lbTabCumulative.classList.remove("active");
    renderLeaderboardList("daily");
  });

  function renderLeaderboardList(tabType) {
    leaderboardList.innerHTML = "";
    const list = window.storageManager.getRankedLeaderboard(tabType);

    list.forEach(entry => {
      const row = document.createElement("div");
      row.className = "lb-row";
      if (entry.isPlayer) row.classList.add("player-row");

      let rankClass = "";
      if (entry.rank === 1) rankClass = "gold";
      else if (entry.rank === 2) rankClass = "silver";
      else if (entry.rank === 3) rankClass = "bronze";

      const scoreVal = tabType === "daily" ? (entry.daily || 0) : (entry.cumulative || 0);

      row.innerHTML = `
        <div class="lb-left">
          <span class="lb-rank ${rankClass}">#${entry.rank}</span>
          <span class="lb-avatar">${entry.avatar || '🎬'}</span>
          <div class="lb-name-group">
            <div class="lb-name">${escapeHtml(entry.name)} ${entry.isPlayer ? '(You)' : ''}</div>
            <div class="lb-title-tag">${entry.title || 'Cinephile'}</div>
          </div>
        </div>
        <div class="lb-right">
          <span class="lb-score">${scoreVal} Pts</span>
          <span class="lb-streak">🔥 ${entry.streak || 1}d streak</span>
        </div>
      `;
      leaderboardList.appendChild(row);
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // --- Profile Modal ---
  profileBtn.addEventListener("click", () => {
    const prof = window.storageManager.profile;
    playerNameInput.value = prof.name;
    selectedAvatar = prof.avatar || "🎬";
    profileModalAvatar.textContent = selectedAvatar;
    profileCumulativeVal.textContent = `${prof.cumulativePoints} Pts`;
    profileStreakVal.textContent = `🔥 ${prof.dailyStreak} Day${prof.dailyStreak > 1 ? 's' : ''}`;
    profileMaxLevelVal.textContent = `Level ${prof.highestLevelReached} / 20`;

    avatarOptions.forEach(opt => {
      opt.style.borderColor = opt.dataset.avatar === selectedAvatar ? "var(--gold-glow)" : "rgba(255,255,255,0.2)";
    });

    profileModal.classList.add("active");
  });

  avatarOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      selectedAvatar = opt.dataset.avatar;
      profileModalAvatar.textContent = selectedAvatar;
      avatarOptions.forEach(o => {
        o.style.borderColor = o.dataset.avatar === selectedAvatar ? "var(--gold-glow)" : "rgba(255,255,255,0.2)";
      });
    });
  });

  saveProfileBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name) {
      window.storageManager.updatePlayerName(name, selectedAvatar);
      profileAvatar.textContent = selectedAvatar;
    }
    profileModal.classList.remove("active");
  });

  closeProfileBtn.addEventListener("click", () => {
    profileModal.classList.remove("active");
  });

  // --- Rules Modal ---
  rulesBtn.addEventListener("click", () => {
    rulesModal.classList.add("active");
  });

  closeRulesBtn.addEventListener("click", () => {
    rulesModal.classList.remove("active");
  });

  // --- Sound Toggle ---
  soundBtn.addEventListener("click", () => {
    const isMuted = window.soundEngine.toggleMute();
    soundIcon.textContent = isMuted ? "🔇" : "🔊";
  });
  soundIcon.textContent = window.soundEngine.isMuted() ? "🔇" : "🔊";

  // --- Confetti Cannon Engine ---
  const confettiCanvas = document.getElementById("confettiCanvas");
  let confettiCtx = confettiCanvas.getContext("2d");
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  function startConfetti() {
    confettiParticles = [];
    const colors = ["#ffc83b", "#ff3366", "#00f0aa", "#00d2ff", "#ffffff", "#e67e22"];
    for (let i = 0; i < 150; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        w: Math.random() * 8 + 4,
        h: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 4,
        velY: Math.random() * 4 + 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8
      });
    }
    if (!confettiAnimId) loopConfetti();
  }

  function loopConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.x += p.velX;
      p.y += p.velY;
      p.rot += p.rotSpeed;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rot * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();

      if (p.y > confettiCanvas.height) {
        p.y = -10;
        p.x = Math.random() * confettiCanvas.width;
      }
    });
    confettiAnimId = requestAnimationFrame(loopConfetti);
  }

  function stopConfetti() {
    if (confettiAnimId) {
      cancelAnimationFrame(confettiAnimId);
      confettiAnimId = null;
    }
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }

  // --- Start First Game ---
  game.startNewGame("mixed", false);
});

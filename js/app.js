/**
 * Hollywood-Bollywood Main Application Controller
 * Handles UI events, input, rendering, modals, Challenge Friends mode,
 * Golden & Purple Movie Tickets, WhatsApp sharing, and Real-Time Cloud Leaderboard.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements: Top Header ---
  const headerPoints = document.getElementById("headerPoints");
  const goldenTicketCount = document.getElementById("goldenTicketCount");
  const purpleTicketCount = document.getElementById("purpleTicketCount");
  const openChallengeModalBtn = document.getElementById("openChallengeModalBtn");
  const soundBtn = document.getElementById("soundBtn");
  const soundIcon = document.getElementById("soundIcon");
  const rulesBtn = document.getElementById("rulesBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const profileBtn = document.getElementById("profileBtn");
  const profileAvatar = document.getElementById("profileAvatar");

  // HUD Elements
  const hudLevelLabel = document.getElementById("hudLevelLabel");
  const hudLevelText = document.getElementById("hudLevelText");
  const hudLevelBarFill = document.getElementById("hudLevelBarFill");
  const hudCenterLabel = document.getElementById("hudCenterLabel");
  const hudStreakText = document.getElementById("hudStreakText");
  const hudScoreText = document.getElementById("hudScoreText");

  // Marquee & Clapper Elements
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

  // --- Modals ---

  // Welcome / Name Capture Modal (Requirement 1)
  const welcomeModal = document.getElementById("welcomeModal");
  const welcomeNameInput = document.getElementById("welcomeNameInput");
  const welcomeStartBtn = document.getElementById("welcomeStartBtn");
  const welcomeAvatarPicker = document.getElementById("welcomeAvatarPicker");
  let selectedWelcomeAvatar = "🎬";

  // Level Win Modal (Requirement 3: WhatsApp nudge)
  const levelWinModal = document.getElementById("levelWinModal");
  const winUnusedBreakdownLabel = document.getElementById("winUnusedBreakdownLabel");
  const winUnusedBreakdownVal = document.getElementById("winUnusedBreakdownVal");
  const winTotalBreakdownVal = document.getElementById("winTotalBreakdownVal");
  const nextLevelBtn = document.getElementById("nextLevelBtn");
  const shareLevelWhatsappBtn = document.getElementById("shareLevelWhatsappBtn");

  // Game Over Modal
  const gameOverModal = document.getElementById("gameOverModal");
  const gameOverMovieTitle = document.getElementById("gameOverMovieTitle");
  const gameOverLevel = document.getElementById("gameOverLevel");
  const gameOverScore = document.getElementById("gameOverScore");
  const retryGameBtn = document.getElementById("retryGameBtn");
  const shareGameOverWhatsappBtn = document.getElementById("shareGameOverWhatsappBtn");
  const gameOverLeaderboardBtn = document.getElementById("gameOverLeaderboardBtn");

  // Grand 20-Level Victory Modal (Requirement 5: Golden Ticket)
  const victoryModal = document.getElementById("victoryModal");
  const victoryFinalScore = document.getElementById("victoryFinalScore");
  const victoryGoldenTotal = document.getElementById("victoryGoldenTotal");
  const shareVictoryWhatsappBtn = document.getElementById("shareVictoryWhatsappBtn");
  const victoryRestartBtn = document.getElementById("victoryRestartBtn");
  const victoryLeaderboardBtn = document.getElementById("victoryLeaderboardBtn");

  // Challenge Friends Launcher Modal (Requirement 4)
  const challengeLauncherModal = document.getElementById("challengeLauncherModal");
  const startChallengeGauntletBtn = document.getElementById("startChallengeGauntletBtn");
  const closeChallengeLauncherBtn = document.getElementById("closeChallengeLauncherBtn");

  // Incoming Challenge Modal
  const incomingChallengeModal = document.getElementById("incomingChallengeModal");
  const incomingChallengerName = document.getElementById("incomingChallengerName");
  const incomingChallengerNameVal = document.getElementById("incomingChallengerNameVal");
  const incomingChallengerTargetVal = document.getElementById("incomingChallengerTargetVal");
  const acceptIncomingChallengeBtn = document.getElementById("acceptIncomingChallengeBtn");
  const declineIncomingChallengeBtn = document.getElementById("declineIncomingChallengeBtn");

  // Challenge Complete Modal (Requirement 4: Purple Ticket)
  const challengeCompleteModal = document.getElementById("challengeCompleteModal");
  const challengeResultIcon = document.getElementById("challengeResultIcon");
  const challengeResultTitle = document.getElementById("challengeResultTitle");
  const challengeResultDesc = document.getElementById("challengeResultDesc");
  const challengeFinalScoreVal = document.getElementById("challengeFinalScoreVal");
  const challengeRivalRow = document.getElementById("challengeRivalRow");
  const challengeRivalLabel = document.getElementById("challengeRivalLabel");
  const challengeRivalScoreVal = document.getElementById("challengeRivalScoreVal");
  const challengePurpleTicketsTotal = document.getElementById("challengePurpleTicketsTotal");
  const shareChallengeWhatsappBtn = document.getElementById("shareChallengeWhatsappBtn");
  const copyChallengeLinkBtn = document.getElementById("copyChallengeLinkBtn");
  const closeChallengeCompleteBtn = document.getElementById("closeChallengeCompleteBtn");

  // Leaderboard Modal (Requirement 2: Real Cloud Scores)
  const leaderboardModal = document.getElementById("leaderboardModal");
  const lbTabCumulative = document.getElementById("lbTabCumulative");
  const lbTabDaily = document.getElementById("lbTabDaily");
  const lbTabTickets = document.getElementById("lbTabTickets");
  const leaderboardList = document.getElementById("leaderboardList");
  const liveSyncStatus = document.getElementById("liveSyncStatus");
  const refreshLeaderboardBtn = document.getElementById("refreshLeaderboardBtn");
  const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");

  // Profile Modal
  const profileModal = document.getElementById("profileModal");
  const profileModalAvatar = document.getElementById("profileModalAvatar");
  const playerNameInput = document.getElementById("playerNameInput");
  const profileGoldenTicketsVal = document.getElementById("profileGoldenTicketsVal");
  const profilePurpleTicketsVal = document.getElementById("profilePurpleTicketsVal");
  const profileCumulativeVal = document.getElementById("profileCumulativeVal");
  const profileStreakVal = document.getElementById("profileStreakVal");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const closeProfileBtn = document.getElementById("closeProfileBtn");
  const avatarOptions = document.querySelectorAll(".avatar-option");

  // Rules Modal
  const rulesModal = document.getElementById("rulesModal");
  const closeRulesBtn = document.getElementById("closeRulesBtn");

  // --- App State ---
  let selectedProfileAvatar = "🎬";
  let currentLeaderboardTab = "cumulative";
  let isHintRevealed = false;
  let activeChallengeLink = "";
  let lastCompletedLevelData = null;

  // QWERTY keyboard layout
  const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];

  // --- Initialize Game Engine ---
  const game = new BollywoodHollywoodGame({
    mode: "mixed",
    onUpdate: renderGameState,
    onLevelComplete: handleLevelWon,
    onGameOver: handleGameOver,
    onVictory: handleGameVictory,
    onChallengeComplete: handleChallengeWon
  });

  // --- Render Functions ---
  function renderGameState(state) {
    const isChallenge = state.gameType === "challenge";

    // Top HUD
    if (isChallenge) {
      hudLevelLabel.textContent = "⚔️ Challenge";
      hudLevelText.textContent = `${String(state.level).padStart(2, '0')} / 05`;
      const progressPercent = Math.min(100, Math.round((state.level / 5) * 100));
      hudLevelBarFill.style.width = `${progressPercent}%`;

      if (state.challengerName && state.challengerScore !== null) {
        hudCenterLabel.textContent = `Target (${state.challengerName})`;
        hudStreakText.textContent = `🎯 ${state.challengerScore} Pts`;
      } else {
        hudCenterLabel.textContent = "Gauntlet";
        hudStreakText.textContent = "5 Movies";
      }
    } else {
      hudLevelLabel.textContent = "Level";
      hudLevelText.textContent = `${String(state.level).padStart(2, '0')} / 20`;
      const progressPercent = Math.min(100, Math.round((state.level / 20) * 100));
      hudLevelBarFill.style.width = `${progressPercent}%`;

      hudCenterLabel.textContent = "Daily Streak";
      const prof = window.storageManager ? window.storageManager.profile : null;
      hudStreakText.textContent = prof ? `🔥 ${prof.dailyStreak} Day${prof.dailyStreak > 1 ? 's' : ''}` : "🔥 1 Day";
    }

    hudScoreText.textContent = `${state.totalScore}`;

    // Profile & Ticket Badges
    const profile = window.storageManager ? window.storageManager.profile : null;
    if (profile) {
      headerPoints.textContent = `${profile.cumulativePoints} Pts`;
      profileAvatar.textContent = profile.avatar || "🎬";
      goldenTicketCount.textContent = profile.goldenTickets || 0;
      purpleTicketCount.textContent = profile.purpleTickets || 0;
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

    // Incorrect Guesses List
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

    // Movie Details
    movieYearTag.textContent = `📅 Year: ${state.movieInfo.year || "Classic"}`;
    movieGenreTag.textContent = `🎭 Genre: ${state.movieInfo.genre || "Drama"}`;

    // Hint Reset/Display (Disabled/Hidden in CSS)
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

  // --- Hint System (Preserved in code) ---
  hintToggleBtn.addEventListener("click", () => {
    if (!isHintRevealed) {
      isHintRevealed = true;
      if (window.soundEngine) window.soundEngine.playHint();
      hintContent.textContent = `💡 Clue: "${game.currentMovie.hint}"`;
      hintToggleBtn.textContent = "Clue Revealed";
      hintToggleBtn.disabled = true;
    }
  });

  // --- Requirement 1: Welcome & Name Capture at Start ---
  function checkInitialPlayerName() {
    if (!window.storageManager.isPlayerNameSet()) {
      welcomeModal.classList.add("active");
    }
  }

  welcomeAvatarPicker.querySelectorAll(".avatar-option").forEach(opt => {
    opt.addEventListener("click", () => {
      welcomeAvatarPicker.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      selectedWelcomeAvatar = opt.dataset.avatar;
    });
  });

  welcomeStartBtn.addEventListener("click", () => {
    const entered = welcomeNameInput.value.trim();
    const finalName = entered.length > 0 ? entered : "Cinephile_" + Math.floor(100 + Math.random() * 900);
    window.storageManager.setPlayerName(finalName, selectedWelcomeAvatar);
    welcomeModal.classList.remove("active");
    renderGameState(game);
  });

  // --- WhatsApp Share Nudge Helper (Requirement 3) ---
  function openWhatsAppShare(text) {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  // --- Modal Logic: Level Won ---
  function handleLevelWon(data) {
    isHintRevealed = false;
    lastCompletedLevelData = data;
    winUnusedBreakdownLabel.textContent = `Unused Guesses (${data.unusedGuesses} remaining)`;
    winUnusedBreakdownVal.textContent = `+${data.unusedPoints} Pts`;
    winTotalBreakdownVal.textContent = `+${data.levelScore} Pts`;

    levelWinModal.classList.add("active");
  }

  nextLevelBtn.addEventListener("click", () => {
    levelWinModal.classList.remove("active");
    game.nextLevel();
  });

  // WhatsApp Nudge after every single level win (Requirement 3)
  shareLevelWhatsappBtn.addEventListener("click", () => {
    if (!lastCompletedLevelData) return;
    const movieTitle = lastCompletedLevelData.movie ? lastCompletedLevelData.movie.title : "a movie";
    const text = `🍿 I just guessed *${movieTitle}* on Level ${lastCompletedLevelData.level}/${lastCompletedLevelData.maxLevels} in Hollywood-Bollywood Movie Guesser!\nSafe guesses left: ${lastCompletedLevelData.unusedGuesses}/9 (+${lastCompletedLevelData.unusedPoints} bonus pts)\nTotal Score: ${lastCompletedLevelData.totalScore} pts 🔥\n\nCan you beat my Cinema IQ? Play here:\nhttps://hollywood-bollywood-movie-guesser.vercel.app`;
    openWhatsAppShare(text);
  });

  // --- Modal Logic: Game Over ---
  function handleGameOver(data) {
    isHintRevealed = false;
    gameOverMovieTitle.textContent = data.movie ? data.movie.title : "Unknown Movie";
    gameOverLevel.textContent = `Level ${data.level} / ${data.maxLevels}`;
    gameOverScore.textContent = `${data.totalScore} Pts`;
    gameOverModal.classList.add("active");
  }

  retryGameBtn.addEventListener("click", () => {
    gameOverModal.classList.remove("active");
    if (game.gameType === "challenge") {
      game.startChallengeGame(game.challengeSeed, game.challengerName, game.challengerScore);
    } else {
      game.startNewGame(game.mode, game.isDaily);
    }
  });

  shareGameOverWhatsappBtn.addEventListener("click", () => {
    const text = `🎬 I reached Level ${game.currentLevel} with ${game.totalScore} pts in Hollywood-Bollywood Movie Guesser!\nThink you know more Bollywood & Hollywood movies than me? Prove it:\nhttps://hollywood-bollywood-movie-guesser.vercel.app`;
    openWhatsAppShare(text);
  });

  gameOverLeaderboardBtn.addEventListener("click", () => {
    gameOverModal.classList.remove("active");
    openLeaderboard();
  });

  // --- Requirement 5: Grand 20-Level Victory (Golden Movie Ticket) ---
  function handleGameVictory(data) {
    isHintRevealed = false;
    victoryFinalScore.textContent = `${data.finalScore} Pts`;
    victoryGoldenTotal.textContent = `🎟️✨ ${data.goldenTickets || 1}`;
    victoryModal.classList.add("active");
    startConfetti();
  }

  shareVictoryWhatsappBtn.addEventListener("click", () => {
    const text = `🎟️✨ GOLDEN MOVIE TICKET UNLOCKED!\nI conquered all 20 levels in Hollywood-Bollywood Movie Guesser with a score of ${game.totalScore} pts!\n\nThink you're a bigger Bollywood & Hollywood cinephile? Prove it here:\nhttps://hollywood-bollywood-movie-guesser.vercel.app`;
    openWhatsAppShare(text);
  });

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

  // --- Requirement 4: Challenge Friends Mode ---
  openChallengeModalBtn.addEventListener("click", () => {
    challengeLauncherModal.classList.add("active");
  });

  closeChallengeLauncherBtn.addEventListener("click", () => {
    challengeLauncherModal.classList.remove("active");
  });

  startChallengeGauntletBtn.addEventListener("click", () => {
    challengeLauncherModal.classList.remove("active");
    const seed = Math.random().toString(36).substring(2, 8).toUpperCase();
    game.startChallengeGame(seed, null, null);
  });

  // Check incoming challenge link on page load
  function checkIncomingChallenge() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("challenge")) {
      const seed = params.get("challenge");
      const from = params.get("from") || "A Friend";
      const score = params.get("score") || 80;

      incomingChallengerName.textContent = from;
      incomingChallengerNameVal.textContent = from;
      incomingChallengerTargetVal.textContent = `${score} Pts`;

      incomingChallengeModal.classList.add("active");

      acceptIncomingChallengeBtn.onclick = () => {
        incomingChallengeModal.classList.remove("active");
        game.startChallengeGame(seed, from, score);
      };

      declineIncomingChallengeBtn.onclick = () => {
        incomingChallengeModal.classList.remove("active");
        game.startNewGame("mixed", false);
      };
    }
  }

  // Handle Challenge Won / Completed
  function handleChallengeWon(data) {
    isHintRevealed = false;
    challengeFinalScoreVal.textContent = `${data.finalScore} Pts`;
    challengePurpleTicketsTotal.textContent = `🎟️💜 ${data.purpleTickets || 0}`;

    const playerName = window.storageManager.profile.name;
    const challengeUrl = `https://hollywood-bollywood-movie-guesser.vercel.app/?challenge=${data.challengeSeed}&from=${encodeURIComponent(playerName)}&score=${data.finalScore}`;
    activeChallengeLink = challengeUrl;

    if (data.challengerScore !== null) {
      // Player was playing against a challenger!
      challengeRivalRow.style.display = "flex";
      challengeRivalLabel.textContent = `${data.challengerName || 'Challenger'}'s Score:`;
      challengeRivalScoreVal.textContent = `${data.challengerScore} Pts`;

      if (data.wonChallenge) {
        challengeResultIcon.textContent = "🎟️💜👑";
        challengeResultTitle.textContent = "VICTORY! CHALLENGE WON!";
        challengeResultDesc.textContent = `You scored ${data.finalScore} pts vs ${data.challengerName}'s ${data.challengerScore} pts! You earned a Purple Movie Ticket 🎟️💜!`;
        startConfetti();
      } else {
        challengeResultIcon.textContent = "🎬⚔️";
        challengeResultTitle.textContent = "CHALLENGE CONCLUDED!";
        challengeResultDesc.textContent = `You scored ${data.finalScore} pts vs ${data.challengerName}'s ${data.challengerScore} pts. So close! Challenge them back to win a Purple Ticket!`;
      }
    } else {
      // Player created a fresh challenge
      challengeRivalRow.style.display = "none";
      challengeResultIcon.textContent = "🎟️💜⚔️";
      challengeResultTitle.textContent = "5-MOVIE RUN COMPLETE!";
      challengeResultDesc.textContent = `You scored ${data.finalScore} pts! Send this challenge to a friend on WhatsApp. If they can't beat you, you reign supreme! You earned a Purple Movie Ticket 🎟️💜!`;
      startConfetti();
    }

    challengeCompleteModal.classList.add("active");
  }

  shareChallengeWhatsappBtn.addEventListener("click", () => {
    const playerName = window.storageManager.profile.name;
    const text = `⚔️ FILMI CHALLENGE! I scored ${game.totalScore} pts across 5 movies in Hollywood-Bollywood Challenge Mode and earned a Purple Ticket 🎟️💜!\n\nCan you beat my score on the EXACT same 5 movies? Click to play:\n${activeChallengeLink}`;
    openWhatsAppShare(text);
  });

  copyChallengeLinkBtn.addEventListener("click", () => {
    if (activeChallengeLink) {
      navigator.clipboard.writeText(activeChallengeLink).then(() => {
        copyChallengeLinkBtn.textContent = "✅ Link Copied to Clipboard!";
        setTimeout(() => {
          copyChallengeLinkBtn.textContent = "📋 Copy Challenge Link";
        }, 2500);
      });
    }
  });

  closeChallengeCompleteBtn.addEventListener("click", () => {
    challengeCompleteModal.classList.remove("active");
    stopConfetti();
    game.startNewGame("mixed", false);
  });

  // --- Requirement 2: Real-time Cloud Leaderboard ---
  async function openLeaderboard() {
    renderLeaderboardList(currentLeaderboardTab);
    leaderboardModal.classList.add("active");

    // Fetch fresh cloud scores
    liveSyncStatus.innerHTML = '<span class="live-dot" style="background:#ffc83b;"></span> Syncing with Cloud Database...';
    await window.storageManager.fetchCloudLeaderboard();
    liveSyncStatus.innerHTML = '<span class="live-dot"></span> Live Cloud Database (Global)';
    renderLeaderboardList(currentLeaderboardTab);
  }

  leaderboardBtn.addEventListener("click", openLeaderboard);
  closeLeaderboardBtn.addEventListener("click", () => {
    leaderboardModal.classList.remove("active");
  });

  refreshLeaderboardBtn.addEventListener("click", async () => {
    liveSyncStatus.innerHTML = '<span class="live-dot" style="background:#ffc83b;"></span> Syncing...';
    await window.storageManager.fetchCloudLeaderboard();
    liveSyncStatus.innerHTML = '<span class="live-dot"></span> Live Cloud Database (Global)';
    renderLeaderboardList(currentLeaderboardTab);
  });

  lbTabCumulative.addEventListener("click", () => {
    currentLeaderboardTab = "cumulative";
    lbTabCumulative.classList.add("active");
    lbTabDaily.classList.remove("active");
    lbTabTickets.classList.remove("active");
    renderLeaderboardList("cumulative");
  });

  lbTabDaily.addEventListener("click", () => {
    currentLeaderboardTab = "daily";
    lbTabDaily.classList.add("active");
    lbTabCumulative.classList.remove("active");
    lbTabTickets.classList.remove("active");
    renderLeaderboardList("daily");
  });

  lbTabTickets.addEventListener("click", () => {
    currentLeaderboardTab = "tickets";
    lbTabTickets.classList.add("active");
    lbTabCumulative.classList.remove("active");
    lbTabDaily.classList.remove("active");
    renderLeaderboardList("tickets");
  });

  function renderLeaderboardList(tabType) {
    leaderboardList.innerHTML = "";
    const list = window.storageManager.getRankedLeaderboard(tabType);

    if (list.length === 0) {
      leaderboardList.innerHTML = '<div style="color:var(--text-muted); padding:20px 0;">No scores yet. Be the first!</div>';
      return;
    }

    list.forEach(entry => {
      const row = document.createElement("div");
      row.className = "lb-row";
      if (entry.isPlayer) row.classList.add("player-row");

      let rankClass = "";
      if (entry.rank === 1) rankClass = "gold";
      else if (entry.rank === 2) rankClass = "silver";
      else if (entry.rank === 3) rankClass = "bronze";

      let scoreVal = "";
      if (tabType === "daily") {
        scoreVal = `${entry.daily || 0} Pts`;
      } else if (tabType === "tickets") {
        scoreVal = `🎟️✨ ${entry.goldenTickets || 0} | 🎟️💜 ${entry.purpleTickets || 0}`;
      } else {
        scoreVal = `${entry.cumulative || 0} Pts`;
      }

      const ticketsSub = `<div class="lb-ticket-sub"><span>🎟️✨ ${entry.goldenTickets || 0}</span><span>🎟️💜 ${entry.purpleTickets || 0}</span></div>`;

      row.innerHTML = `
        <div class="lb-left">
          <span class="lb-rank ${rankClass}">#${entry.rank}</span>
          <span class="lb-avatar">${entry.avatar || '🎬'}</span>
          <div class="lb-name-group">
            <div class="lb-name">${escapeHtml(entry.name || 'Anonymous')} ${entry.isPlayer ? '(You)' : ''}</div>
            <div class="lb-title-tag">${entry.title || 'Cinephile'}</div>
          </div>
        </div>
        <div class="lb-right">
          <span class="lb-score">${scoreVal}</span>
          ${tabType !== 'tickets' ? ticketsSub : `<span class="lb-streak">🔥 ${entry.streak || 1}d streak</span>`}
        </div>
      `;
      leaderboardList.appendChild(row);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // --- Profile Modal Logic ---
  profileBtn.addEventListener("click", () => {
    const prof = window.storageManager.profile;
    playerNameInput.value = prof.name;
    selectedProfileAvatar = prof.avatar || "🎬";
    profileModalAvatar.textContent = selectedProfileAvatar;
    profileGoldenTicketsVal.textContent = `🎟️✨ ${prof.goldenTickets || 0}`;
    profilePurpleTicketsVal.textContent = `🎟️💜 ${prof.purpleTickets || 0}`;
    profileCumulativeVal.textContent = `${prof.cumulativePoints} Pts`;
    profileStreakVal.textContent = `🔥 ${prof.dailyStreak} Day${prof.dailyStreak > 1 ? 's' : ''}`;

    avatarOptions.forEach(opt => {
      if (opt.dataset.avatar === selectedProfileAvatar) {
        opt.classList.add("selected");
      } else {
        opt.classList.remove("selected");
      }
    });

    profileModal.classList.add("active");
  });

  avatarOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      selectedProfileAvatar = opt.dataset.avatar;
      profileModalAvatar.textContent = selectedProfileAvatar;
      avatarOptions.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });

  saveProfileBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name) {
      window.storageManager.updatePlayerName(name, selectedProfileAvatar);
      profileAvatar.textContent = selectedProfileAvatar;
    }
    profileModal.classList.remove("active");
    renderGameState(game);
  });

  closeProfileBtn.addEventListener("click", () => {
    profileModal.classList.remove("active");
  });

  // --- Rules Modal Logic ---
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

  function isAnyModalOpen() {
    return document.querySelector(".modal-overlay.active") !== null;
  }

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
    const colors = ["#ffc83b", "#b084ff", "#00f0aa", "#00d2ff", "#ffffff", "#ff3366"];
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

  // --- App Initialization Sequence ---
  checkInitialPlayerName();
  checkIncomingChallenge();

  // If no incoming challenge modal opened, start normal run
  if (!incomingChallengeModal.classList.contains("active")) {
    game.startNewGame("mixed", false);
  }
});

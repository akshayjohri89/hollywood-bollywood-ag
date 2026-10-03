/**
 * LocalStorage & Leaderboard Management
 * Handles player profiles, daily streak tracking, cumulative points, and leaderboard rankings.
 */

const STORAGE_KEYS = {
  PROFILE: "bh_player_profile",
  LEADERBOARD: "bh_leaderboard_data",
  DAILY_STATE: "bh_daily_state"
};

const DEFAULT_RIVALS = [
  { name: "Simran_Raj_95", avatar: "🎬", cumulative: 2450, daily: 320, streak: 14, title: "Bollywood Legend" },
  { name: "Nolan_Disciple", avatar: "🌌", cumulative: 2180, daily: 295, streak: 9, title: "Hollywood Buff" },
  { name: "Gabbar_Singh", avatar: "💥", cumulative: 1890, daily: 270, streak: 12, title: "Cinema Sholay" },
  { name: "TarantinoFan", avatar: "🍿", cumulative: 1640, daily: 310, streak: 7, title: "Pulp Buff" },
  { name: "Kareena_Pooh", avatar: "👑", cumulative: 1420, daily: 240, streak: 5, title: "Glamour Cinephile" },
  { name: "Scorsese_Mob", avatar: "🎥", cumulative: 1250, daily: 260, streak: 8, title: "Goodfella" },
  { name: "Vicky_Kaushal_Fan", avatar: "⚡", cumulative: 980, daily: 210, streak: 4, title: "Josh Cinephile" },
  { name: "Matrix_Neo", avatar: "🕶️", cumulative: 820, daily: 190, streak: 3, title: "The Chosen One" },
  { name: "Mogambo_Happy", avatar: "🎭", cumulative: 690, daily: 175, streak: 2, title: "Movie Mogul" }
];

class StorageManager {
  constructor() {
    this.profile = this.loadProfile();
    this.checkDailyReset();
    this.leaderboard = this.loadLeaderboard();
  }

  getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    const today = this.getTodayKey();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.avatar) parsed.avatar = "🎬";
        if (parsed.cumulativePoints === undefined) parsed.cumulativePoints = 0;
        if (parsed.dailyStreak === undefined) parsed.dailyStreak = 1;
        if (!parsed.name) parsed.name = "CinemaStar";
        if (parsed.dailyPointsToday === undefined) parsed.dailyPointsToday = 0;
        return parsed;
      } catch (e) {
        console.error("Error parsing profile, resetting to default:", e);
      }
    }

    const defaultProfile = {
      name: "CinemaBuff_" + Math.floor(1000 + Math.random() * 9000),
      avatar: "🎬",
      cumulativePoints: 0,
      dailyStreak: 1,
      lastPlayedDate: today,
      dailyPointsToday: 0,
      todayLevelsCompleted: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      highestLevelReached: 1,
      bestRunScore: 0
    };
    this.saveProfile(defaultProfile);
    return defaultProfile;
  }

  saveProfile(profileData) {
    if (profileData) this.profile = profileData;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile));
  }

  checkDailyReset() {
    const today = this.getTodayKey();
    if (this.profile.lastPlayedDate !== today) {
      const lastDate = new Date(this.profile.lastPlayedDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        this.profile.dailyStreak += 1;
      } else if (diffDays > 1) {
        // Streak broken
        this.profile.dailyStreak = 1;
      }

      this.profile.lastPlayedDate = today;
      this.profile.dailyPointsToday = 0;
      this.profile.todayLevelsCompleted = 0;
      this.saveProfile();
    }
  }

  recordLevelVictory(pointsEarned, levelNum, isDailyMode = false) {
    this.checkDailyReset();
    this.profile.cumulativePoints += pointsEarned;
    this.profile.dailyPointsToday += pointsEarned;

    if (levelNum > this.profile.highestLevelReached) {
      this.profile.highestLevelReached = levelNum;
    }
    if (levelNum > this.profile.todayLevelsCompleted) {
      this.profile.todayLevelsCompleted = levelNum;
    }

    this.saveProfile();
    this.syncLeaderboard();
  }

  recordGameFinished(finalRunScore, wonGame) {
    this.profile.gamesPlayed += 1;
    if (wonGame) {
      this.profile.gamesWon += 1;
    }
    if (finalRunScore > (this.profile.bestRunScore || 0)) {
      this.profile.bestRunScore = finalRunScore;
    }
    this.saveProfile();
    this.syncLeaderboard();
  }

  loadLeaderboard() {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Leaderboard parse error:", e);
      }
    }
    // Initialise with defaults
    const initial = JSON.parse(JSON.stringify(DEFAULT_RIVALS));
    this.saveLeaderboard(initial);
    return initial;
  }

  saveLeaderboard(data) {
    this.leaderboard = data;
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(data));
  }

  syncLeaderboard() {
    let board = this.loadLeaderboard();
    let playerIndex = board.findIndex(p => p.isPlayer === true);

    const playerEntry = {
      name: this.profile.name,
      avatar: this.profile.avatar,
      cumulative: this.profile.cumulativePoints,
      daily: this.profile.dailyPointsToday,
      streak: this.profile.dailyStreak,
      title: this.getTitleForScore(this.profile.cumulativePoints),
      isPlayer: true
    };

    if (playerIndex >= 0) {
      board[playerIndex] = playerEntry;
    } else {
      board.push(playerEntry);
    }

    this.saveLeaderboard(board);
  }

  getRankedLeaderboard(type = "cumulative") {
    this.syncLeaderboard();
    const list = [...this.leaderboard];

    if (type === "daily") {
      list.sort((a, b) => (b.daily || 0) - (a.daily || 0));
    } else {
      list.sort((a, b) => (b.cumulative || 0) - (a.cumulative || 0));
    }

    return list.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  }

  getTitleForScore(score) {
    if (score >= 3000) return "Oscar & Filmfare Winner 🏆";
    if (score >= 2000) return "Cinema Maestro 🎬";
    if (score >= 1200) return "Film Director 🎥";
    if (score >= 600) return "Senior Critic 🍿";
    if (score >= 250) return "Movie Buff 🎟️";
    return "Aspiring Cinephile 🌱";
  }

  updatePlayerName(newName, avatar = null) {
    if (newName && newName.trim().length > 0) {
      this.profile.name = newName.trim().substring(0, 16);
    }
    if (avatar) {
      this.profile.avatar = avatar;
    }
    this.saveProfile();
    this.syncLeaderboard();
  }
}

window.storageManager = new StorageManager();

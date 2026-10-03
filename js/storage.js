/**
 * Storage & Leaderboard Management
 * Handles player profiles, daily streak tracking, cumulative points,
 * Golden & Purple Movie Tickets, and real-time cloud database synchronization.
 */

const STORAGE_KEYS = {
  PROFILE: "bh_player_profile",
  LEADERBOARD: "bh_leaderboard_data",
  DAILY_STATE: "bh_daily_state",
  NAME_SET: "bh_player_name_set"
};

// Fallback seed players if cloud DB is unreachable
const DEFAULT_RIVALS = [
  { name: "Simran_Raj_95", avatar: "🎬", cumulative: 2450, daily: 320, streak: 14, goldenTickets: 3, purpleTickets: 5, title: "Bollywood Legend" },
  { name: "Nolan_Disciple", avatar: "🌌", cumulative: 2180, daily: 295, streak: 9, goldenTickets: 2, purpleTickets: 4, title: "Hollywood Buff" },
  { name: "Gabbar_Singh", avatar: "💥", cumulative: 1890, daily: 270, streak: 12, goldenTickets: 2, purpleTickets: 3, title: "Cinema Sholay" },
  { name: "TarantinoFan", avatar: "🍿", cumulative: 1640, daily: 310, streak: 7, goldenTickets: 1, purpleTickets: 4, title: "Pulp Buff" },
  { name: "Kareena_Pooh", avatar: "👑", cumulative: 1420, daily: 240, streak: 5, goldenTickets: 1, purpleTickets: 2, title: "Glamour Cinephile" },
  { name: "Scorsese_Mob", avatar: "🎥", cumulative: 1250, daily: 260, streak: 8, goldenTickets: 1, purpleTickets: 3, title: "Goodfella" },
  { name: "Vicky_Kaushal_Fan", avatar: "⚡", cumulative: 980, daily: 210, streak: 4, goldenTickets: 0, purpleTickets: 2, title: "Josh Cinephile" },
  { name: "Matrix_Neo", avatar: "🕶️", cumulative: 820, daily: 190, streak: 3, goldenTickets: 0, purpleTickets: 1, title: "The Chosen One" },
  { name: "Mogambo_Happy", avatar: "🎭", cumulative: 690, daily: 175, streak: 2, goldenTickets: 0, purpleTickets: 1, title: "Movie Mogul" }
];

// Cloud storage endpoints (Primary REST bin + Vercel serverless proxy)
const CLOUD_ENDPOINTS = [
  "/api/leaderboard",
  "https://extendsclass.com/api/json-storage/bin/fdecfec"
];

class StorageManager {
  constructor() {
    this.profile = this.loadProfile();
    this.checkDailyReset();
    this.leaderboard = this.loadLeaderboard();
    this.cloudLeaderboard = [];
    this.isCloudSyncing = false;

    // Trigger initial cloud fetch
    this.fetchCloudLeaderboard();
  }

  getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  isPlayerNameSet() {
    return localStorage.getItem(STORAGE_KEYS.NAME_SET) === "true";
  }

  setPlayerName(name, avatar = null) {
    if (name && name.trim().length > 0) {
      this.profile.name = name.trim().substring(0, 16);
    }
    if (avatar) {
      this.profile.avatar = avatar;
    }
    localStorage.setItem(STORAGE_KEYS.NAME_SET, "true");
    this.saveProfile();
    this.syncLeaderboard();
    this.pushScoreToCloud();
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
        if (parsed.goldenTickets === undefined) parsed.goldenTickets = 0;
        if (parsed.purpleTickets === undefined) parsed.purpleTickets = 0;
        if (parsed.dailyPointsToday === undefined) parsed.dailyPointsToday = 0;
        return parsed;
      } catch (e) {
        console.error("Error parsing profile:", e);
      }
    }

    const defaultProfile = {
      name: "CinemaBuff_" + Math.floor(1000 + Math.random() * 9000),
      avatar: "🎬",
      cumulativePoints: 0,
      dailyStreak: 1,
      goldenTickets: 0,
      purpleTickets: 0,
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
        this.profile.dailyStreak += 1;
      } else if (diffDays > 1) {
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
    this.pushScoreToCloud();
  }

  // Award Golden Movie Ticket (Level 20 completed!)
  awardGoldenTicket() {
    this.profile.goldenTickets = (this.profile.goldenTickets || 0) + 1;
    this.saveProfile();
    this.syncLeaderboard();
    this.pushScoreToCloud();
    return this.profile.goldenTickets;
  }

  // Award Purple Movie Ticket (Challenge Friends won!)
  awardPurpleTicket() {
    this.profile.purpleTickets = (this.profile.purpleTickets || 0) + 1;
    this.saveProfile();
    this.syncLeaderboard();
    this.pushScoreToCloud();
    return this.profile.purpleTickets;
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
    this.pushScoreToCloud();
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
      goldenTickets: this.profile.goldenTickets || 0,
      purpleTickets: this.profile.purpleTickets || 0,
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

  // --- Real-time Cloud Database Integration ---

  async fetchCloudLeaderboard() {
    for (const url of CLOUD_ENDPOINTS) {
      try {
        const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
        if (res.ok) {
          const data = await res.json();
          let list = Array.isArray(data.leaderboard) ? data.leaderboard : [];
          if (list.length > 0) {
            this.cloudLeaderboard = list;
            this.mergeCloudLeaderboard(list);
            return list;
          }
        }
      } catch (err) {
        // Fall back to next endpoint
      }
    }
    return this.leaderboard;
  }

  mergeCloudLeaderboard(cloudList) {
    let localBoard = this.loadLeaderboard();
    const map = new Map();

    // Add local entries
    localBoard.forEach(entry => {
      map.set(entry.name.toLowerCase(), entry);
    });

    // Merge or update with cloud entries
    cloudList.forEach(entry => {
      const key = entry.name.toLowerCase();
      const isCurrentPlayer = entry.name.toLowerCase() === this.profile.name.toLowerCase();

      if (isCurrentPlayer) {
        // Keep our latest local record for current player
        map.set(key, {
          name: this.profile.name,
          avatar: this.profile.avatar,
          cumulative: Math.max(entry.cumulative || 0, this.profile.cumulativePoints),
          daily: Math.max(entry.daily || 0, this.profile.dailyPointsToday),
          streak: Math.max(entry.streak || 1, this.profile.dailyStreak),
          goldenTickets: Math.max(entry.goldenTickets || 0, this.profile.goldenTickets || 0),
          purpleTickets: Math.max(entry.purpleTickets || 0, this.profile.purpleTickets || 0),
          title: this.getTitleForScore(this.profile.cumulativePoints),
          isPlayer: true
        });
      } else {
        map.set(key, { ...entry, isPlayer: false });
      }
    });

    const merged = Array.from(map.values());
    this.saveLeaderboard(merged);
  }

  async pushScoreToCloud() {
    if (this.isCloudSyncing) return;
    this.isCloudSyncing = true;

    const payload = {
      name: this.profile.name,
      avatar: this.profile.avatar,
      cumulative: this.profile.cumulativePoints,
      daily: this.profile.dailyPointsToday,
      streak: this.profile.dailyStreak,
      goldenTickets: this.profile.goldenTickets || 0,
      purpleTickets: this.profile.purpleTickets || 0,
      title: this.getTitleForScore(this.profile.cumulativePoints)
    };

    try {
      // Post to our serverless /api/leaderboard
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Fallback: update cloud bin directly if running on client
      try {
        let currentData = { leaderboard: this.leaderboard };
        const getRes = await fetch("https://extendsclass.com/api/json-storage/bin/fdecfec");
        if (getRes.ok) currentData = await getRes.json();
        let list = Array.isArray(currentData.leaderboard) ? currentData.leaderboard : [];
        const idx = list.findIndex(p => p.name && p.name.toLowerCase() === payload.name.toLowerCase());
        if (idx >= 0) list[idx] = { ...list[idx], ...payload };
        else list.push(payload);

        await fetch("https://extendsclass.com/api/json-storage/bin/fdecfec", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leaderboard: list })
        });
      } catch (err2) {}
    } finally {
      this.isCloudSyncing = false;
    }
  }

  getRankedLeaderboard(type = "cumulative") {
    this.syncLeaderboard();
    const list = [...this.leaderboard];

    if (type === "daily") {
      list.sort((a, b) => (b.daily || 0) - (a.daily || 0));
    } else if (type === "tickets") {
      list.sort((a, b) => {
        const totalA = (a.goldenTickets || 0) * 10 + (a.purpleTickets || 0);
        const totalB = (b.goldenTickets || 0) * 10 + (b.purpleTickets || 0);
        return totalB - totalA;
      });
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
    this.setPlayerName(newName, avatar);
  }
}

window.storageManager = new StorageManager();

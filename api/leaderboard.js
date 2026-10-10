/**
 * Vercel Serverless Function: /api/leaderboard
 * Connects to the cloud database to store and retrieve real player scores.
 */

const CLOUD_STORAGE_URL = "https://extendsclass.com/api/json-storage/bin/fdecfec";

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      const response = await fetch(CLOUD_STORAGE_URL, {
        headers: { "Cache-Control": "no-cache" }
      });
      if (!response.ok) {
        throw new Error(`Cloud storage returned ${response.status}`);
      }
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      let payload = req.body;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch (e) {}
      }

      if (!payload || !payload.name) {
        return res.status(400).json({ error: "Player name is required" });
      }

      // Fetch current data
      let currentData = { leaderboard: [] };
      try {
        const getRes = await fetch(CLOUD_STORAGE_URL);
        if (getRes.ok) {
          currentData = await getRes.json();
        }
      } catch (err) {
        console.error("Error reading current storage:", err);
      }

      let list = Array.isArray(currentData.leaderboard) ? currentData.leaderboard : [];

      // Update or insert player entry
      const existingIndex = list.findIndex(
        p => p.name && p.name.trim().toLowerCase() === payload.name.trim().toLowerCase()
      );

      const updatedEntry = {
        name: payload.name.trim().substring(0, 16),
        avatar: payload.avatar || "🎬",
        cumulative: Number(payload.cumulative) || 0,
        daily: Number(payload.daily) || 0,
        streak: Number(payload.streak) || 1,
        goldenTickets: Number(payload.goldenTickets) || 0,
        purpleTickets: Number(payload.purpleTickets) || 0,
        title: payload.title || "Movie Buff",
        lastUpdated: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        // Keep highest scores and ticket totals
        const existing = list[existingIndex];
        updatedEntry.cumulative = Math.max(existing.cumulative || 0, updatedEntry.cumulative);
        updatedEntry.daily = Math.max(existing.daily || 0, updatedEntry.daily);
        updatedEntry.goldenTickets = Math.max(existing.goldenTickets || 0, updatedEntry.goldenTickets);
        updatedEntry.purpleTickets = Math.max(existing.purpleTickets || 0, updatedEntry.purpleTickets);
        updatedEntry.streak = Math.max(existing.streak || 1, updatedEntry.streak);
        list[existingIndex] = updatedEntry;
      } else {
        list.push(updatedEntry);
      }

      // Sort by cumulative points
      list.sort((a, b) => (b.cumulative || 0) - (a.cumulative || 0));

      // Limit to top 100 players
      list = list.slice(0, 100);

      // Save back to cloud database (preserve challenges and metadata)
      await fetch(CLOUD_STORAGE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentData, leaderboard: list })
      });

      return res.status(200).json({ success: true, entry: updatedEntry, leaderboard: list });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Vercel Serverless Function: /api/challenge
 * Handles asynchronous 2-player Challenge Mode:
 * - Creates shareable challenge sessions with deterministic movie seeds
 * - Records Creator & Friend scores independently
 * - Automatically computes the winner and completion status once both players finish
 */

const CLOUD_STORAGE_URL = "https://extendsclass.com/api/json-storage/bin/fdecfec";

module.exports = async (req, res) => {
  // CORS Headers
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
    // --- GET /api/challenge?id=CHLG-XXXX ---
    if (req.method === "GET") {
      const challengeId = req.query.id;
      const response = await fetch(CLOUD_STORAGE_URL, {
        headers: { "Cache-Control": "no-cache" }
      });
      if (!response.ok) {
        throw new Error(`Cloud storage error: ${response.status}`);
      }
      const data = await response.json();
      const challenges = data.challenges || {};

      if (challengeId) {
        const item = challenges[challengeId] || null;
        return res.status(200).json({ success: true, challenge: item });
      }
      return res.status(200).json({ success: true, challenges });
    }

    // --- POST /api/challenge ---
    if (req.method === "POST") {
      let payload = req.body;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch (e) {}
      }

      if (!payload || !payload.id) {
        return res.status(400).json({ error: "Challenge ID is required" });
      }

      // Fetch existing cloud storage data
      let currentData = { leaderboard: [], challenges: {} };
      try {
        const getRes = await fetch(CLOUD_STORAGE_URL, {
          headers: { "Cache-Control": "no-cache" }
        });
        if (getRes.ok) {
          currentData = await getRes.json();
        }
      } catch (err) {
        console.error("Error reading storage for challenge:", err);
      }

      if (!currentData.challenges || typeof currentData.challenges !== "object") {
        currentData.challenges = {};
      }

      const challengeId = String(payload.id).trim().toUpperCase();
      const action = payload.action || "create";

      if (action === "create") {
        const seed = payload.seed ? String(payload.seed).trim().toUpperCase() : challengeId.replace(/^CHLG-/, '');
        const creatorName = (payload.creatorName || payload.playerName || "Cinephile").trim().substring(0, 16);

        // If challenge already exists, don't overwrite existing progress
        if (!currentData.challenges[challengeId]) {
          currentData.challenges[challengeId] = {
            id: challengeId,
            seed: seed,
            creatorName: creatorName,
            creatorScore: null,
            creatorCompleted: false,
            friendName: null,
            friendScore: null,
            friendCompleted: false,
            status: "created", // created | waiting_friend | waiting_creator | completed
            winner: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        } else {
          // Update creator name if provided
          if (creatorName && !currentData.challenges[challengeId].creatorName) {
            currentData.challenges[challengeId].creatorName = creatorName;
          }
        }
      } else if (action === "submit_score") {
        let ch = currentData.challenges[challengeId];
        if (!ch) {
          // Initialize if friend submitted before record reached cloud
          const seed = payload.seed ? String(payload.seed).trim().toUpperCase() : challengeId.replace(/^CHLG-/, '');
          ch = {
            id: challengeId,
            seed: seed,
            creatorName: "Challenger",
            creatorScore: null,
            creatorCompleted: false,
            friendName: null,
            friendScore: null,
            friendCompleted: false,
            status: "in_progress",
            winner: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          currentData.challenges[challengeId] = ch;
        }

        const role = payload.role === "friend" ? "friend" : "creator";
        const score = Number(payload.score) || 0;
        const name = (payload.playerName || payload.name || "Player").trim().substring(0, 16);

        if (role === "creator") {
          ch.creatorName = name;
          ch.creatorScore = score;
          ch.creatorCompleted = true;
        } else {
          ch.friendName = name;
          ch.friendScore = score;
          ch.friendCompleted = true;
        }

        ch.updatedAt = new Date().toISOString();

        // Check if both players have now completed
        if (ch.creatorCompleted && ch.friendCompleted) {
          ch.status = "completed";
          ch.completedAt = new Date().toISOString();

          if (ch.creatorScore > ch.friendScore) {
            ch.winner = ch.creatorName;
          } else if (ch.friendScore > ch.creatorScore) {
            ch.winner = ch.friendName;
          } else {
            ch.winner = "tie";
          }
        } else if (ch.creatorCompleted) {
          ch.status = "waiting_friend";
        } else if (ch.friendCompleted) {
          ch.status = "waiting_creator";
        }
      }

      // Prune old challenges if over 60 entries
      const keys = Object.keys(currentData.challenges);
      if (keys.length > 60) {
        const sortedKeys = keys.sort((a, b) => {
          const dateA = new Date(currentData.challenges[a].createdAt || 0).getTime();
          const dateB = new Date(currentData.challenges[b].createdAt || 0).getTime();
          return dateB - dateA;
        });
        const pruned = {};
        sortedKeys.slice(0, 60).forEach(k => {
          pruned[k] = currentData.challenges[k];
        });
        currentData.challenges = pruned;
      }

      // Save back to cloud database
      await fetch(CLOUD_STORAGE_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentData)
      });

      return res.status(200).json({
        success: true,
        challenge: currentData.challenges[challengeId]
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Challenge API error:", error);
    return res.status(500).json({ error: error.message });
  }
};

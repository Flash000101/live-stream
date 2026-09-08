const express = require("express");
const path = require("path");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const activeStreams = new Map();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/livekit-config", (_req, res) => {
  res.json({
    url: process.env.LIVEKIT_URL || null
  });
});

// Get currently live streams
app.get("/api/live", (_req, res) => {
  const now = Date.now();

  for (const [roomName, stream] of activeStreams) {
    if (now - stream.lastSeen > 45000) {
      activeStreams.delete(roomName);
    }
  }

  res.json({
    streams: Array.from(activeStreams.entries()).map(([roomName, stream]) => ({
      roomName,
      ...stream
    }))
  });
});

// Creator announces that they are live
app.post("/api/live/announce", (req, res) => {
  const { roomName, title, creator } = req.body;

  if (!roomName || !title || !creator) {
    return res.status(400).json({
      error: "roomName, title and creator are required"
    });
  }

  const oldStream = activeStreams.get(roomName);

  activeStreams.set(roomName, {
    title: String(title).slice(0, 70),
    creator: String(creator).slice(0, 50),
    startedAt: oldStream?.startedAt || Date.now(),
    lastSeen: Date.now()
  });

  res.json({ ok: true });
});

// Creator stops live
app.delete("/api/live/:roomName", (req, res) => {
  activeStreams.delete(req.params.roomName);
  res.json({ ok: true });
});

// LiveKit token
app.post("/api/livekit-token", async (req, res) => {
  try {
    const {
      roomName,
      identity,
      role = "viewer"
    } = req.body;

    if (!roomName || !identity) {
      return res.status(400).json({
        error: "roomName and identity are required"
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        error: "LiveKit credentials are not configured"
      });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: "2h"
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: role === "host",
      canSubscribe: true
    });

    const jwt = await token.toJwt();

    res.json({ token: jwt });

  } catch (error) {
    console.error("LiveKit token error:", error);

    res.status(500).json({
      error: "Failed to create LiveKit token"
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`LiveStream is running on port ${port}`);
});
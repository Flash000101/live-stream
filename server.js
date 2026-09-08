const express = require("express");
const path = require("path");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// LiveKit public configuration
app.get("/api/livekit-config", (_req, res) => {
  res.json({
    url: process.env.LIVEKIT_URL || null
  });
});

// Secure LiveKit token generation
app.post("/api/livekit-token", async (req, res) => {
  try {
    const { roomName, identity } = req.body;

    if (!roomName || !identity) {
      return res.status(400).json({
        error: "roomName and identity are required"
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({
        error: "LiveKit credentials are not configured on the server"
      });
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: identity,
      ttl: "2h"
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
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
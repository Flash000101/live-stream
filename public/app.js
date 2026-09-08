const liveStreams = [
  ["https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=700&q=80", "Late Night Beats", "DJ Vanya", "8.2K watching"],
  ["https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80", "The Creative Room", "Ava Sullivan", "2.1K watching"],
  ["https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=700&q=80", "Studio After Hours", "Jordan Miles", "5.6K watching"]
];

const shorts = [
  ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80", "Get ready with me", "Maya · 1.2M views"],
  ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80", "Golden hour", "Zoe · 848K views"],
  ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80", "Sunday energy", "Kia · 582K views"],
  ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80", "A new look", "Lena · 410K views"],
  ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80", "City diary", "Aria · 326K views"]
];

const videos = [
  ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80", "Behind the festival: our story", "Skyline Studio · 48K views", "18:42"],
  ["https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=700&q=80", "Traveling light through Tokyo", "Noah Reed · 82K views", "12:07"],
  ["https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=80", "Making an album from scratch", "Mila Rae · 28K views", "24:16"]
];

document.querySelector("#liveGrid").innerHTML =
  liveStreams.map(([image, title, creator, watching]) =>
    `<article class="stream-card">
      <div class="stream-image">
        <img src="${image}" alt="${title}">
        <span class="small-live">● LIVE</span>
        <span class="watching">◉ ${watching}</span>
      </div>
      <div class="stream-details">
        <h3>${title}</h3>
        <p>${creator}</p>
      </div>
    </article>`
  ).join("");

document.querySelector("#shortsRow").innerHTML =
  shorts.map(([image, title, meta]) =>
    `<article class="short-card">
      <img src="${image}" alt="${title}">
      <div class="short-meta">
        <strong>${title}</strong>
        <span>${meta}</span>
      </div>
    </article>`
  ).join("");

document.querySelector("#videoGrid").innerHTML =
  videos.map(([image, title, meta, duration]) =>
    `<article class="video-card">
      <div class="video-thumb">
        <img src="${image}" alt="${title}">
        <span class="duration">${duration}</span>
      </div>
      <div class="video-details">
        <h3>${title}</h3>
        <p>${meta}</p>
      </div>
    </article>`
  ).join("");


// ==========================================
// UPLOAD MODAL
// ==========================================

const modal = document.querySelector("#uploadModal");

const openModal = () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

["#openUpload", "#heroUpload", "#bannerUpload"].forEach((id) => {
  const button = document.querySelector(id);
  if (button) button.addEventListener("click", openModal);
});

const closeUpload = document.querySelector("#closeUpload");

if (closeUpload) {
  closeUpload.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
}

const uploadForm = document.querySelector("#uploadForm");

if (uploadForm) {
  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.querySelector("#videoTitle").value;

    document.querySelector("#uploadNote").textContent =
      `“${title}” is ready in demo mode. Cloud video storage will be connected next.`;

    event.currentTarget.reset();
  });
}


// ==========================================
// CHAT
// ==========================================

const panel = document.querySelector(".chat-panel");

const chatToggle = document.querySelector("#chatToggle");
const chatClose = document.querySelector("#chatClose");
const chatForm = document.querySelector("#chatForm");

if (chatToggle) {
  chatToggle.addEventListener("click", () => {
    panel.classList.toggle("open");
  });
}

if (chatClose) {
  chatClose.addEventListener("click", () => {
    panel.classList.remove("open");
  });
}

if (chatForm) {
  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.querySelector("#chatInput");
    const message = input.value.trim();

    if (!message) return;

    const item = document.createElement("p");

    item.innerHTML =
      `<b>@you</b> ${message.replace(/[<>&]/g, "")}`;

    document.querySelector("#messages").append(item);

    input.value = "";

    item.scrollIntoView({
      behavior: "smooth"
    });
  });
}


// ==========================================
// LIVEKIT LIVE STREAMING
// ==========================================

let livekitClient = null;
let livekitRoom = null;

async function loadLiveKit() {

  if (livekitClient) {
    return livekitClient;
  }

  livekitClient = await import(
    "https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.esm.mjs"
  );

  return livekitClient;
}


// ------------------------------------------
// LIVE MODAL ELEMENTS
// ------------------------------------------

const goLiveButton = document.querySelector("#goLiveButton");
const liveModal = document.querySelector("#liveModal");
const closeLive = document.querySelector("#closeLive");
const startLive = document.querySelector("#startLive");
const stopLive = document.querySelector("#stopLive");
const localVideo = document.querySelector("#localVideo");
const liveStatus = document.querySelector("#liveStatus");
const liveTitle = document.querySelector("#liveTitle");


function openLiveModal() {

  if (!liveModal) return;

  liveModal.classList.add("open");
  liveModal.setAttribute("aria-hidden", "false");

  if (liveStatus) {
    liveStatus.textContent = "Ready to start";
  }
}


function closeLiveModal() {

  if (livekitRoom) {
    stopLiveStream();
  }

  if (!liveModal) return;

  liveModal.classList.remove("open");
  liveModal.setAttribute("aria-hidden", "true");
}


if (goLiveButton) {
  goLiveButton.addEventListener("click", openLiveModal);
}


if (closeLive) {
  closeLive.addEventListener("click", closeLiveModal);
}


// ------------------------------------------
// START LIVE
// ------------------------------------------

async function startLiveStream() {

  try {

    if (startLive) {
      startLive.disabled = true;
    }

    if (liveStatus) {
      liveStatus.textContent =
        "Connecting to LiveKit...";
    }


    const LiveKit = await loadLiveKit();


    // Create room name
    const cleanTitle =
      liveTitle?.value
        ?.trim()
        .replace(/[^a-zA-Z0-9-_]/g, "-");


    const roomName =
      cleanTitle ||
      `live-${Date.now()}`;


    // Unique creator identity
    const identity =
      `creator-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;


    // --------------------------------------
    // GET SECURE TOKEN FROM OUR SERVER
    // --------------------------------------

    const tokenResponse = await fetch(
      "/api/livekit-token",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          roomName,
          identity
        })
      }
    );


    const tokenData =
      await tokenResponse.json();


    if (!tokenResponse.ok) {

      throw new Error(
        tokenData.error ||
        "LiveKit token generation failed"
      );
    }


    // --------------------------------------
    // GET LIVEKIT URL
    // --------------------------------------

    const configResponse =
      await fetch("/api/livekit-config");


    const config =
      await configResponse.json();


    if (!config.url) {

      throw new Error(
        "LIVEKIT_URL is not configured"
      );
    }


    // --------------------------------------
    // CREATE LIVEKIT ROOM
    // --------------------------------------

    livekitRoom =
      new LiveKit.Room({
        adaptiveStream: true,
        dynacast: true
      });


    // Connect
    await livekitRoom.connect(
      config.url,
      tokenData.token
    );


    if (liveStatus) {

      liveStatus.textContent =
        "Connected. Starting camera and microphone...";
    }


    // --------------------------------------
    // ENABLE CAMERA
    // --------------------------------------

    await livekitRoom.localParticipant
      .setCameraEnabled(true);


    // --------------------------------------
    // ENABLE MICROPHONE
    // --------------------------------------

    await livekitRoom.localParticipant
      .setMicrophoneEnabled(true);


    // --------------------------------------
    // SHOW LOCAL CAMERA
    // --------------------------------------

    for (
      const publication
      of livekitRoom.localParticipant
        .videoTrackPublications.values()
    ) {

      if (publication.track) {

        const mediaTrack =
          publication.track.mediaStreamTrack;

        if (localVideo) {

          localVideo.srcObject =
            new MediaStream([
              mediaTrack
            ]);

          await localVideo.play();
        }

        break;
      }
    }


    if (liveStatus) {

      liveStatus.textContent =
        "🔴 LIVE — You are connected to LiveKit";
    }


    if (startLive) {

      startLive.textContent =
        "🔴 LIVE";

      startLive.disabled = true;
    }


  } catch (error) {

    console.error(
      "LiveKit connection error:",
      error
    );


    if (liveStatus) {

      liveStatus.textContent =
        `Error: ${error.message}`;
    }


    if (startLive) {
      startLive.disabled = false;
    }
  }
}


// ------------------------------------------
// STOP LIVE
// ------------------------------------------

async function stopLiveStream() {

  try {

    if (livekitRoom) {

      await livekitRoom.localParticipant
        .setCameraEnabled(false);

      await livekitRoom.localParticipant
        .setMicrophoneEnabled(false);

      livekitRoom.disconnect();

      livekitRoom = null;
    }


    if (localVideo) {
      localVideo.srcObject = null;
    }


    if (liveStatus) {
      liveStatus.textContent =
        "Stream stopped";
    }


    if (startLive) {

      startLive.textContent =
        "Start Live";

      startLive.disabled = false;
    }


  } catch (error) {

    console.error(
      "Stop live error:",
      error
    );
  }
}


if (startLive) {
  startLive.addEventListener(
    "click",
    startLiveStream
  );
}


if (stopLive) {
  stopLive.addEventListener(
    "click",
    stopLiveStream
  );
}
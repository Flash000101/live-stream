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


// ==========================================
// STATIC CONTENT
// ==========================================

const liveGrid = document.querySelector("#liveGrid");

if (liveGrid) {
  liveGrid.innerHTML =
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
}


const shortsRow = document.querySelector("#shortsRow");

if (shortsRow) {
  shortsRow.innerHTML =
    shorts.map(([image, title, meta]) =>
      `<article class="short-card">
        <img src="${image}" alt="${title}">
        <div class="short-meta">
          <strong>${title}</strong>
          <span>${meta}</span>
        </div>
      </article>`
    ).join("");
}


const videoGrid = document.querySelector("#videoGrid");

if (videoGrid) {
  videoGrid.innerHTML =
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
}


// ==========================================
// UPLOAD MODAL
// ==========================================

const modal = document.querySelector("#uploadModal");

const openModal = () => {
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};


["#openUpload", "#heroUpload", "#bannerUpload"].forEach((id) => {
  const button = document.querySelector(id);

  if (button) {
    button.addEventListener("click", openModal);
  }
});


const closeUpload = document.querySelector("#closeUpload");

if (closeUpload) {
  closeUpload.addEventListener("click", closeModal);
}


if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}


const uploadForm = document.querySelector("#uploadForm");

if (uploadForm) {
  uploadForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const titleElement =
      document.querySelector("#videoTitle");

    const uploadNote =
      document.querySelector("#uploadNote");

    const title =
      titleElement?.value || "Video";

    if (uploadNote) {
      uploadNote.textContent =
        `“${title}” is ready in demo mode. Cloud video storage will be connected next.`;
    }

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

    if (panel) {
      panel.classList.toggle("open");
    }

  });
}


if (chatClose) {
  chatClose.addEventListener("click", () => {

    if (panel) {
      panel.classList.remove("open");
    }

  });
}


if (chatForm) {

  chatForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const input =
      document.querySelector("#chatInput");

    const messages =
      document.querySelector("#messages");

    const message =
      input?.value.trim();

    if (!message || !messages) {
      return;
    }

    const item =
      document.createElement("p");

    item.innerHTML =
      `<b>@you</b> ${message.replace(/[<>&]/g, "")}`;

    messages.append(item);

    input.value = "";

    item.scrollIntoView({
      behavior: "smooth"
    });

  });

}


// ==========================================
// LIVEKIT
// ==========================================

let livekitClient = null;
let livekitRoom = null;

let currentRoomName = null;
let currentCreatorIdentity = null;

let heartbeatTimer = null;


// ==========================================
// LOAD LIVEKIT
// ==========================================

async function loadLiveKit() {

  if (livekitClient) {
    return livekitClient;
  }

  livekitClient = await import(
    "https://cdn.jsdelivr.net/npm/livekit-client/dist/livekit-client.esm.mjs"
  );

  return livekitClient;
}


// ==========================================
// LIVE MODAL
// ==========================================

const goLiveButton =
  document.querySelector("#goLiveButton");

const liveModal =
  document.querySelector("#liveModal");

const closeLive =
  document.querySelector("#closeLive");

const startLive =
  document.querySelector("#startLive");

const stopLive =
  document.querySelector("#stopLive");

const localVideo =
  document.querySelector("#localVideo");

const liveStatus =
  document.querySelector("#liveStatus");

const liveTitle =
  document.querySelector("#liveTitle");


function openLiveModal() {

  if (!liveModal) {
    return;
  }

  liveModal.classList.add("open");

  liveModal.setAttribute(
    "aria-hidden",
    "false"
  );

  if (liveStatus) {
    liveStatus.textContent =
      "Ready to start";
  }

}


async function closeLiveModal() {

  if (livekitRoom) {
    await stopLiveStream();
  }

  if (!liveModal) {
    return;
  }

  liveModal.classList.remove("open");

  liveModal.setAttribute(
    "aria-hidden",
    "true"
  );

}


if (goLiveButton) {
  goLiveButton.addEventListener(
    "click",
    openLiveModal
  );
}


if (closeLive) {
  closeLive.addEventListener(
    "click",
    closeLiveModal
  );
}


// ==========================================
// ANNOUNCE LIVE
// ==========================================

async function announceLive() {

  if (!currentRoomName) {
    return;
  }

  const title =
    liveTitle?.value?.trim() ||
    "Live Stream";

  const creator =
    localStorage.getItem("livestream_creator") ||
    "Live Creator";


  const response =
    await fetch("/api/live/announce", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        roomName:
          currentRoomName,

        title:
          title,

        creator:
          creator

      })

    });


  if (!response.ok) {

    throw new Error(
      "Could not publish your live stream"
    );

  }

}


// ==========================================
// HEARTBEAT
// ==========================================

function startHeartbeat() {

  stopHeartbeat();

  heartbeatTimer =
    setInterval(async () => {

      try {

        await announceLive();

      } catch (error) {

        console.error(
          "Live heartbeat error:",
          error
        );

      }

    }, 20000);

}


function stopHeartbeat() {

  if (heartbeatTimer) {

    clearInterval(
      heartbeatTimer
    );

    heartbeatTimer = null;

  }

}


// ==========================================
// START LIVE
// ==========================================

async function startLiveStream() {

  try {

    if (startLive) {
      startLive.disabled = true;
    }

    if (liveStatus) {
      liveStatus.textContent =
        "Connecting to LiveKit...";
    }


    const LiveKit =
      await loadLiveKit();


    // --------------------------------------
    // ROOM NAME
    // --------------------------------------

    const cleanTitle =
      liveTitle?.value
        ?.trim()
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 50);


    currentRoomName =
      cleanTitle ||
      `live-${Date.now()}`;


    // --------------------------------------
    // CREATOR IDENTITY
    // --------------------------------------

    currentCreatorIdentity =
      `creator-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;


    // Save demo creator name
    localStorage.setItem(
      "livestream_creator",
      "You"
    );


    // --------------------------------------
    // GET HOST TOKEN
    // --------------------------------------

    const tokenResponse =
      await fetch(
        "/api/livekit-token",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            roomName:
              currentRoomName,

            identity:
              currentCreatorIdentity,

            role:
              "host"

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
    // LIVEKIT CONFIG
    // --------------------------------------

    const configResponse =
      await fetch(
        "/api/livekit-config"
      );


    const config =
      await configResponse.json();


    if (!config.url) {

      throw new Error(
        "LIVEKIT_URL is not configured"
      );

    }


    // --------------------------------------
    // CREATE ROOM
    // --------------------------------------

    livekitRoom =
      new LiveKit.Room({

        adaptiveStream: true,

        dynacast: true

      });


    // --------------------------------------
    // CONNECT
    // --------------------------------------

    await livekitRoom.connect(
      config.url,
      tokenData.token
    );


    if (liveStatus) {

      liveStatus.textContent =
        "Connected. Starting camera and microphone...";

    }


    // --------------------------------------
    // CAMERA
    // --------------------------------------

    await livekitRoom.localParticipant
      .setCameraEnabled(true);


    // --------------------------------------
    // MICROPHONE
    // --------------------------------------

    await livekitRoom.localParticipant
      .setMicrophoneEnabled(true);


    // --------------------------------------
    // SHOW LOCAL VIDEO
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


    // --------------------------------------
    // ANNOUNCE PUBLIC LIVE
    // --------------------------------------

    await announceLive();


    // --------------------------------------
    // START HEARTBEAT
    // --------------------------------------

    startHeartbeat();


    if (liveStatus) {

      liveStatus.textContent =
        "🔴 LIVE — Everyone can now watch you";

    }


    if (startLive) {

      startLive.textContent =
        "🔴 LIVE";

      startLive.disabled =
        true;

    }


    // Refresh live cards
    loadLiveStreams();


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

      startLive.disabled =
        false;

    }

  }

}


// ==========================================
// STOP LIVE
// ==========================================

async function stopLiveStream() {

  try {

    stopHeartbeat();


    // --------------------------------------
    // REMOVE PUBLIC LISTING
    // --------------------------------------

    if (currentRoomName) {

      await fetch(
        `/api/live/${encodeURIComponent(currentRoomName)}`,
        {
          method: "DELETE"
        }
      );

    }


    // --------------------------------------
    // DISCONNECT LIVEKIT
    // --------------------------------------

    if (livekitRoom) {

      try {

        await livekitRoom.localParticipant
          .setCameraEnabled(false);

        await livekitRoom.localParticipant
          .setMicrophoneEnabled(false);

      } catch (error) {

        console.warn(
          "Could not disable media:",
          error
        );

      }


      livekitRoom.disconnect();

      livekitRoom = null;

    }


    if (localVideo) {

      localVideo.srcObject =
        null;

    }


    currentRoomName =
      null;

    currentCreatorIdentity =
      null;


    if (liveStatus) {

      liveStatus.textContent =
        "Stream stopped";

    }


    if (startLive) {

      startLive.textContent =
        "Start Live";

      startLive.disabled =
        false;

    }


    // Refresh live cards
    loadLiveStreams();


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


// ==========================================
// PUBLIC LIVE STREAM LIST
// ==========================================

async function loadLiveStreams() {

  try {

    const response =
      await fetch("/api/live");


    if (!response.ok) {
      return;
    }


    const data =
      await response.json();


    renderLiveStreams(
      data.streams || []
    );


  } catch (error) {

    console.error(
      "Could not load live streams:",
      error
    );

  }

}


// ==========================================
// RENDER LIVE STREAMS
// ==========================================

function renderLiveStreams(streams) {

  if (!liveGrid) {
    return;
  }


  if (!streams.length) {

    liveGrid.innerHTML =
      liveStreams.map(
        ([image, title, creator, watching]) =>
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

    return;
  }


  liveGrid.innerHTML =
    streams.map((stream) => {

      const safeTitle =
        escapeHtml(stream.title);

      const safeCreator =
        escapeHtml(stream.creator);

      const safeRoom =
        encodeURIComponent(
          stream.roomName
        );


      return `
        <article
          class="stream-card"
          data-room="${safeRoom}"
          style="cursor:pointer"
        >

          <div class="stream-image">

            <div
              style="
                width:100%;
                aspect-ratio:16/9;
                background:linear-gradient(135deg,#111,#333);
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:48px;
                color:white;
              "
            >
              🔴
            </div>

            <span class="small-live">
              ● LIVE
            </span>

            <span class="watching">
              ◉ LIVE NOW
            </span>

          </div>

          <div class="stream-details">

            <h3>
              ${safeTitle}
            </h3>

            <p>
              ${safeCreator}
            </p>

          </div>

        </article>
      `;

    }).join("");


  document
    .querySelectorAll(
      "#liveGrid .stream-card[data-room]"
    )
    .forEach((card) => {

      card.addEventListener(
        "click",
        () => {

          const room =
            decodeURIComponent(
              card.dataset.room
            );

          const stream =
            streams.find(
              item =>
                item.roomName === room
            );

          if (stream) {
            openViewer(
              stream
            );
          }

        }
      );

    });

}


// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


// ==========================================
// VIEWER MODAL
// ==========================================

let viewerModal = null;
let viewerRoom = null;


function createViewerModal() {

  if (viewerModal) {
    return;
  }


  viewerModal =
    document.createElement("div");


  viewerModal.id =
    "viewerModal";


  viewerModal.className =
    "modal-backdrop";


  viewerModal.setAttribute(
    "aria-hidden",
    "true"
  );


  viewerModal.innerHTML = `

    <section
      class="modal"
      role="dialog"
      aria-modal="true"
      style="max-width:1000px"
    >

      <button
        id="closeViewer"
        class="close"
        aria-label="Close"
      >
        ×
      </button>

      <p
        class="eyebrow purple"
      >
        LIVE NOW
      </p>

      <h2 id="viewerTitle">
        Live Stream
      </h2>

      <p
        id="viewerCreator"
        style="margin-bottom:16px"
      ></p>

      <div
        id="viewerVideoContainer"
        style="
          position:relative;
          width:100%;
          background:#000;
          border-radius:16px;
          overflow:hidden;
          min-height:400px;
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >

        <video
          id="viewerVideo"
          autoplay
          playsinline
          controls
          style="
            width:100%;
            max-height:70vh;
            object-fit:contain;
            background:#000;
          "
        ></video>

        <div
          id="viewerStatus"
          style="
            position:absolute;
            color:white;
            text-align:center;
            padding:20px;
          "
        >
          Connecting...
        </div>

      </div>

    </section>

  `;


  document.body.appendChild(
    viewerModal
  );


  const closeButton =
    document.querySelector(
      "#closeViewer"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeViewer
    );

  }


  viewerModal.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        viewerModal
      ) {

        closeViewer();

      }

    }
  );

}


async function openViewer(stream) {

  createViewerModal();


  viewerModal.classList.add(
    "open"
  );


  viewerModal.setAttribute(
    "aria-hidden",
    "false"
  );


  const title =
    document.querySelector(
      "#viewerTitle"
    );

  const creator =
    document.querySelector(
      "#viewerCreator"
    );

  const status =
    document.querySelector(
      "#viewerStatus"
    );


  if (title) {

    title.textContent =
      stream.title;

  }


  if (creator) {

    creator.textContent =
      `Live by ${stream.creator}`;

  }


  if (status) {

    status.textContent =
      "Connecting to live stream...";

  }


  try {

    const LiveKit =
      await loadLiveKit();


    // --------------------------------------
    // VIEWER IDENTITY
    // --------------------------------------

    const identity =
      `viewer-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;


    // --------------------------------------
    // GET VIEWER TOKEN
    // --------------------------------------

    const tokenResponse =
      await fetch(
        "/api/livekit-token",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            roomName:
              stream.roomName,

            identity:
              identity,

            role:
              "viewer"

          })

        }
      );


    const tokenData =
      await tokenResponse.json();


    if (!tokenResponse.ok) {

      throw new Error(
        tokenData.error ||
        "Viewer token failed"
      );

    }


    // --------------------------------------
    // CONFIG
    // --------------------------------------

    const configResponse =
      await fetch(
        "/api/livekit-config"
      );


    const config =
      await configResponse.json();


    if (!config.url) {

      throw new Error(
        "LIVEKIT_URL is not configured"
      );

    }


    // --------------------------------------
    // CREATE VIEWER ROOM
    // --------------------------------------

    viewerRoom =
      new LiveKit.Room({

        adaptiveStream: true,

        dynacast: true

      });


    // --------------------------------------
    // RECEIVE TRACKS
    // --------------------------------------

    viewerRoom.on(
      LiveKit.RoomEvent.TrackSubscribed,
      (
        track,
        publication,
        participant
      ) => {

        if (
          track.kind ===
          LiveKit.Track.Kind.Video
        ) {

          const video =
            document.querySelector(
              "#viewerVideo"
            );


          if (video) {

            const element =
              track.attach();

            element.autoplay =
              true;

            element.playsInline =
              true;

            element.controls =
              true;

            element.style.width =
              "100%";

            element.style.maxHeight =
              "70vh";

            element.style.objectFit =
              "contain";

            element.style.background =
              "#000";


            const oldVideo =
              document.querySelector(
                "#viewerVideo"
              );


            if (oldVideo) {

              oldVideo.replaceWith(
                element
              );

            }

          }


          if (status) {

            status.textContent =
              "🔴 LIVE";

          }

        }


        if (
          track.kind ===
          LiveKit.Track.Kind.Audio
        ) {

          const element =
            track.attach();

          element.autoplay =
            true;

          element.style.display =
            "none";

          document.body.appendChild(
            element
          );

        }

      }
    );


    // --------------------------------------
    // CONNECT
    // --------------------------------------

    await viewerRoom.connect(
      config.url,
      tokenData.token
    );


    if (status) {

      status.textContent =
        "🔴 LIVE";

    }


  } catch (error) {

    console.error(
      "Viewer error:",
      error
    );


    if (status) {

      status.textContent =
        `Unable to watch: ${error.message}`;

    }

  }

}


// ==========================================
// CLOSE VIEWER
// ==========================================

function closeViewer() {

  if (viewerRoom) {

    try {
      viewerRoom.disconnect();
    } catch (error) {
      console.error(error);
    }

    viewerRoom = null;

  }


  if (viewerModal) {

    viewerModal.classList.remove(
      "open"
    );

    viewerModal.setAttribute(
      "aria-hidden",
      "true"
    );

  }

}


// ==========================================
// INITIAL LIVE LOAD
// ==========================================

loadLiveStreams();


// Refresh live list every 10 seconds

setInterval(
  loadLiveStreams,
  10000
);
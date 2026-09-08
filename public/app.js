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

document.querySelector("#liveGrid").innerHTML = liveStreams.map(([image, title, creator, watching]) => `<article class="stream-card"><div class="stream-image"><img src="${image}" alt="${title}"><span class="small-live">● LIVE</span><span class="watching">◉ ${watching}</span></div><div class="stream-details"><h3>${title}</h3><p>${creator}</p></div></article>`).join("");
document.querySelector("#shortsRow").innerHTML = shorts.map(([image, title, meta]) => `<article class="short-card"><img src="${image}" alt="${title}"><div class="short-meta"><strong>${title}</strong><span>${meta}</span></div></article>`).join("");
document.querySelector("#videoGrid").innerHTML = videos.map(([image, title, meta, duration]) => `<article class="video-card"><div class="video-thumb"><img src="${image}" alt="${title}"><span class="duration">${duration}</span></div><div class="video-details"><h3>${title}</h3><p>${meta}</p></div></article>`).join("");

const modal = document.querySelector("#uploadModal");
const openModal = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); };
const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
["#openUpload", "#heroUpload", "#bannerUpload"].forEach((id) => document.querySelector(id).addEventListener("click", openModal));
document.querySelector("#closeUpload").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
document.querySelector("#uploadForm").addEventListener("submit", (event) => { event.preventDefault(); const title = document.querySelector("#videoTitle").value; document.querySelector("#uploadNote").textContent = `“${title}” is ready in demo mode. Cloud video storage will be connected next.`; event.currentTarget.reset(); });

const panel = document.querySelector(".chat-panel");
document.querySelector("#chatToggle").addEventListener("click", () => panel.classList.toggle("open"));
document.querySelector("#chatClose").addEventListener("click", () => panel.classList.remove("open"));
document.querySelector("#chatForm").addEventListener("submit", (event) => { event.preventDefault(); const input = document.querySelector("#chatInput"); const message = input.value.trim(); if (!message) return; const item = document.createElement("p"); item.innerHTML = `<b>@you</b> ${message.replace(/[<>&]/g, "")}`; document.querySelector("#messages").append(item); input.value = ""; item.scrollIntoView({ behavior: "smooth" }); });

(function () {
  function initSidebar() {
    const old = document.querySelector(".feature-sidebar");
    if (old) old.remove();

    const sidebar = document.createElement("aside");
    sidebar.className = "feature-sidebar";

    sidebar.innerHTML = `
      <div class="sidebar-profile">
        <a href="profile.html" class="sidebar-avatar">Y</a>
        <div class="sidebar-profile-info">
          <strong>Yolo</strong>
          <span>@yolo007</span>
          <small><i></i> Online</small>
        </div>
        <a href="profile.html" class="sidebar-settings">⚙</a>
      </div>

      <div class="sidebar-divider"></div>

      <nav class="feature-nav">
        <a href="#videoGrid"><span class="feature-icon">V</span><span>Videos</span><span class="arrow">›</span></a>
        <a href="#live"><span class="feature-icon live-icon">●</span><span>Live</span><span class="arrow">›</span></a>
        <a href="#premium" class="feature-premium"><span class="feature-icon">★</span><span>Premium Stars</span><span class="arrow">›</span></a>
        <a href="#categories"><span class="feature-icon">C</span><span>Categories</span><span class="arrow">›</span></a>
        <a href="#creators-list"><span class="feature-icon">◎</span><span>Creators</span><span class="arrow">›</span></a>
        <a href="#channels-list"><span class="feature-icon">◉</span><span>Channels</span><span class="arrow">›</span></a>
        <a href="#chatWidget" id="sidebarChat"><span class="feature-icon">H</span><span>Chat</span><b class="chat-badge">3</b><span class="arrow">›</span></a>
        <a href="#upload" id="sidebarUpload"><span class="feature-icon">↑</span><span>Upload</span><span class="arrow">›</span></a>
      </nav>

      <div class="sidebar-channel">
        <div class="sidebar-label">YOUR CHANNEL</div>
        <button class="create-channel" id="createChannelBtn" type="button">
          <span class="create-channel-icon">+</span>
          <span>
            <strong>Create your channel</strong>
            <small>Start streaming & building your audience</small>
          </span>
        </button>
      </div>

      <div class="sidebar-spacer"></div>

      <div class="sidebar-premium">
        <div class="premium-star">★</div>
        <div class="premium-copy">
          <strong>Go Premium</strong>
          <span>Unlock more features</span>
        </div>
        <button id="sidebarPremiumBtn" type="button">→</button>
      </div>
    `;

    document.body.appendChild(sidebar);

    const chat = document.getElementById("sidebarChat");
    if (chat) {
      chat.onclick = function(e) {
        e.preventDefault();
        const btn = document.getElementById("chatToggle");
        if (btn) btn.click();
      };
    }

    const upload = document.getElementById("sidebarUpload");
    if (upload) {
      upload.onclick = function(e) {
        e.preventDefault();
        const btn = document.getElementById("openUpload");
        if (btn) btn.click();
      };
    }

    const create = document.getElementById("createChannelBtn");
    if (create) {
      create.onclick = function() {
        window.location.href = "profile.html";
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSidebar);
  } else {
    initSidebar();
  }
})();

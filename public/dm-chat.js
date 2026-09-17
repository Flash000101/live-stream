(function () {
  const models = [
    {
      id: "maya",
      name: "Maya",
      handle: "@maya_live",
      status: "Online",
      avatar: "M"
    },
    {
      id: "riya",
      name: "Riya",
      handle: "@riya_live",
      status: "Online",
      avatar: "R"
    },
    {
      id: "sofia",
      name: "Sofia",
      handle: "@sofia_live",
      status: "Online",
      avatar: "S"
    },
    {
      id: "kiara",
      name: "Kiara",
      handle: "@kiara_live",
      status: "Online",
      avatar: "K"
    },
    {
      id: "anaya",
      name: "Anaya",
      handle: "@anaya_live",
      status: "Online",
      avatar: "A"
    }
  ];

  function createDMSystem() {
    if (document.getElementById("dmOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "dmOverlay";
    overlay.className = "dm-overlay";

    overlay.innerHTML = `
      <div class="dm-panel">

        <div class="dm-header">
          <div>
            <strong>Active Models</strong>
            <span>Select someone to start a personal chat</span>
          </div>
          <button id="dmClose" type="button">×</button>
        </div>

        <div id="modelList" class="model-list"></div>

        <div id="personalChat" class="personal-chat hidden">

          <div class="personal-header">
            <button id="backToModels" type="button">‹</button>

            <div class="personal-avatar" id="personalAvatar">M</div>

            <div>
              <strong id="personalName">Maya</strong>
              <span id="personalStatus">● Online</span>
            </div>
          </div>

          <div id="messageArea" class="message-area">
            <div class="empty-chat">
              <div>💬</div>
              <strong>Start a private conversation</strong>
              <span>Your messages here are only for this conversation.</span>
            </div>
          </div>

          <form id="dmForm" class="dm-form">
            <input
              id="dmInput"
              type="text"
              placeholder="Write a private message..."
              autocomplete="off"
              maxlength="500"
            />
            <button type="submit">➤</button>
          </form>

        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const list = document.getElementById("modelList");

    models.forEach(model => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "model-item";

      item.innerHTML = `
        <div class="model-avatar">${model.avatar}</div>
        <div class="model-info">
          <strong>${model.name}</strong>
          <span>${model.handle}</span>
        </div>
        <div class="model-online">
          <i></i>
          ${model.status}
        </div>
      `;

      item.addEventListener("click", () => openPersonalChat(model));
      list.appendChild(item);
    });

    function openPersonalChat(model) {
      document.getElementById("modelList").classList.add("hidden");
      document.querySelector(".dm-header").classList.add("hidden");
      document.getElementById("personalChat").classList.remove("hidden");

      document.getElementById("personalAvatar").textContent = model.avatar;
      document.getElementById("personalName").textContent = model.name;
      document.getElementById("personalStatus").textContent = "● " + model.status;

      document.getElementById("dmInput").focus();
    }

    document.getElementById("backToModels").addEventListener("click", () => {
      document.getElementById("personalChat").classList.add("hidden");
      document.getElementById("modelList").classList.remove("hidden");
      document.querySelector(".dm-header").classList.remove("hidden");
    });

    document.getElementById("dmClose").addEventListener("click", closeDM);

    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeDM();
    });

    document.getElementById("dmForm").addEventListener("submit", e => {
      e.preventDefault();

      const input = document.getElementById("dmInput");
      const text = input.value.trim();

      if (!text) return;

      const area = document.getElementById("messageArea");

      const empty = area.querySelector(".empty-chat");
      if (empty) empty.remove();

      const message = document.createElement("div");
      message.className = "my-message";
      message.textContent = text;

      area.appendChild(message);
      input.value = "";

      area.scrollTop = area.scrollHeight;
    });

    function closeDM() {
      overlay.classList.remove("open");
    }
  }

  function openDM() {
    let overlay = document.getElementById("dmOverlay");

    if (!overlay) {
      createDMSystem();
      overlay = document.getElementById("dmOverlay");
    }

    overlay.classList.add("open");
  }

  document.addEventListener("click", function (e) {
    const chat = e.target.closest("#sidebarChat");

    if (chat) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openDM();
    }
  }, true);
})();

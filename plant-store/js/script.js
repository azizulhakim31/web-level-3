document.addEventListener("DOMContentLoaded", () => {
  // Live date and time, updated every second.
  const updateClock = () => {
    const now = new Date();
    const formatted = now.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    document
      .querySelectorAll(".live-clock")
      .forEach((el) => (el.textContent = formatted));
    document
      .querySelectorAll(".current-year")
      .forEach((el) => (el.textContent = now.getFullYear()));
  };
  updateClock();
  window.setInterval(updateClock, 1000);

  // Demo cart shared by pages in this browser tab/session.
  const storedCart = sessionStorage.getItem("bloomingCartItems");
  let cartItems = storedCart ? JSON.parse(storedCart) : [];
  if (!storedCart) {
    const previousCount =
      Number(sessionStorage.getItem("bloomingCartCount")) || 0;
    if (previousCount > 0) {
      cartItems.push({
        id: "1250-",
        size: "Small",
        addons: [],
        unitPrice: 1250,
        quantity: previousCount,
      });
    }
  }
  const cartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);
  const money = (amount) => Number(amount).toLocaleString("en-BD");
  const updateCartBadges = () => {
    document
      .querySelectorAll(".cart-count")
      .forEach((el) => (el.textContent = cartCount()));
    const count = document.getElementById("cartItemCount");
    if (count) count.textContent = cartCount();
  };
  const saveCart = () => {
    sessionStorage.setItem("bloomingCartItems", JSON.stringify(cartItems));
    sessionStorage.setItem("bloomingCartCount", String(cartCount()));
    updateCartBadges();
  };
  const renderCart = () => {
    const list = document.getElementById("cartItems");
    if (!list) {
      updateCartBadges();
      return;
    }

    list.replaceChildren();
    document
      .getElementById("cartEmpty")
      .classList.toggle("d-none", cartItems.length > 0);
    cartItems.forEach((item) => {
      const row = document.createElement("li");
      row.className =
        "list-group-item d-flex flex-wrap justify-content-between align-items-center gap-3";
      const details = document.createElement("div");
      const name = document.createElement("h3");
      const options = document.createElement("p");
      const linePrice = document.createElement("strong");
      name.className = "h6 mb-1";
      name.textContent = `Monstera Deliciosa — ${item.size}`;
      options.className = "small text-muted mb-0";
      options.textContent = item.addons.length
        ? item.addons.join(" · ")
        : "No add-ons";
      linePrice.className = "small";
      linePrice.textContent = `৳${money(item.unitPrice * item.quantity)}`;
      details.append(name, options, linePrice);

      const controls = document.createElement("div");
      controls.className = "d-flex align-items-center gap-2";
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.className = "btn btn-outline-secondary btn-sm";
      decrease.dataset.cartAction = "decrease";
      decrease.dataset.cartId = item.id;
      decrease.textContent = "−";
      decrease.disabled = item.quantity <= 1;
      decrease.setAttribute(
        "aria-label",
        `Decrease ${item.size} Monstera quantity`,
      );
      const quantity = document.createElement("span");
      quantity.className = "px-1";
      quantity.textContent = item.quantity;
      const increase = document.createElement("button");
      increase.type = "button";
      increase.className = "btn btn-outline-secondary btn-sm";
      increase.dataset.cartAction = "increase";
      increase.dataset.cartId = item.id;
      increase.textContent = "+";
      increase.setAttribute(
        "aria-label",
        `Increase ${item.size} Monstera quantity`,
      );
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn-outline-danger btn-sm ms-2";
      remove.dataset.cartAction = "remove";
      remove.dataset.cartId = item.id;
      remove.textContent = "Remove";
      controls.append(decrease, quantity, increase, remove);
      row.append(details, controls);
      list.append(row);
    });

    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    document.getElementById("cartSubtotal").textContent = `৳${money(subtotal)}`;
    updateCartBadges();
  };
  renderCart();

  // Plant Matchmaker quiz.
  const quiz = document.getElementById("plantQuiz");
  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const sunlight = document.getElementById("sunlight").value;
      const care = document.getElementById("care").value;
      const pets = document.getElementById("pets").value;
      let plant = "Spider Plant";
      let reason = "a forgiving plant with graceful, arching leaves";
      if (pets === "yes") {
        if (sunlight === "bright") {
          plant = "Parlor Palm";
          reason = "a pet-friendlier option that enjoys bright, indirect light";
        } else {
          plant = "Calathea";
          reason = "a pet-friendlier leafy option for indirect or lower light";
        }
        if (care === "easy" && sunlight !== "bright") {
          plant = "Parlor Palm";
          reason = "a relatively easy, pet-friendlier choice for indoor spaces";
        }
      } else if (sunlight === "low") {
        plant = "Snake Plant";
        reason = "a hardy plant that tolerates lower light";
      } else if (sunlight === "direct") {
        plant = "Aloe Vera";
        reason =
          "a sun-loving succulent that prefers its soil to dry between waterings";
      } else if (care === "moderate") {
        plant = "Monstera Deliciosa";
        reason = "a tropical statement plant that rewards a little attention";
      }
      const result = document.getElementById("quizResult");
      result.innerHTML = `<strong>Your match: ${plant} 🌱</strong><br><span>${reason}. Always verify pet safety for the exact plant species before bringing it home.</span>`;
    });
  }

  // Product options, add-ons and demo cart.
  const sizeSelect = document.getElementById("plantSize");
  const price = document.getElementById("plantPrice");
  const total = document.getElementById("totalPrice");
  const addonChecks = document.querySelectorAll(".addon-check");

  const calculateTotal = () => {
    if (!sizeSelect || !total) return;
    const base = Number(sizeSelect.value);
    if (price) price.textContent = money(base);
    const addOns = [...addonChecks]
      .filter((el) => el.checked)
      .reduce((sum, el) => sum + Number(el.value), 0);
    total.textContent = money(base + addOns);
  };
  if (sizeSelect) {
    sizeSelect.addEventListener("change", calculateTotal);
    addonChecks.forEach((el) => el.addEventListener("change", calculateTotal));
    calculateTotal();
  }
  const addToCart = document.getElementById("addToCart");
  if (addToCart) {
    addToCart.addEventListener("click", () => {
      const chosen =
        sizeSelect.options[sizeSelect.selectedIndex].text.split(" — ")[0];
      const selectedAddons = [...addonChecks].filter((el) => el.checked);
      const addonLabels = selectedAddons.map((el) =>
        document.querySelector(`label[for="${el.id}"]`).textContent.trim(),
      );
      const addonTotal = selectedAddons.reduce(
        (sum, addon) => sum + Number(addon.value),
        0,
      );
      const itemId = `${sizeSelect.value}-${selectedAddons
        .map((addon) => addon.id)
        .sort()
        .join("-")}`;
      const existingItem = cartItems.find((item) => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: itemId,
          size: chosen,
          addons: addonLabels,
          unitPrice: Number(sizeSelect.value) + addonTotal,
          quantity: 1,
        });
      }
      saveCart();
      renderCart();
      const message = document.getElementById("cartMessage");
      message.textContent = `${chosen} Monstera added to your demo cart${addonLabels.length ? " with " + addonLabels.join(" and ") : ""}.`;
    });
  }

  const cartList = document.getElementById("cartItems");
  if (cartList) {
    cartList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-cart-action]");
      if (!button) return;
      const item = cartItems.find(
        (entry) => entry.id === button.dataset.cartId,
      );
      if (!item) return;

      if (button.dataset.cartAction === "increase") item.quantity += 1;
      if (button.dataset.cartAction === "decrease")
        item.quantity = Math.max(1, item.quantity - 1);
      if (button.dataset.cartAction === "remove") {
        cartItems = cartItems.filter((entry) => entry.id !== item.id);
      }
      saveCart();
      renderCart();
    });
  }

  document.getElementById("clearCart")?.addEventListener("click", () => {
    cartItems = [];
    saveCart();
    renderCart();
  });

  // Plant Parent Tips: browser-only demo. Photo preview and in-page insertion.
  const tipPhoto = document.getElementById("tipPhoto");
  const tipPreview = document.getElementById("tipPreview");
  let selectedPhotoData = "";
  if (tipPhoto && tipPreview) {
    tipPhoto.addEventListener("change", () => {
      selectedPhotoData = "";
      const file = tipPhoto.files && tipPhoto.files[0];
      if (!file) {
        tipPreview.src = "";
        tipPreview.classList.add("d-none");
        return;
      }
      if (!file.type.startsWith("image/")) {
        tipPhoto.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        selectedPhotoData = reader.result;
        tipPreview.src = selectedPhotoData;
        tipPreview.classList.remove("d-none");
      };
      reader.readAsDataURL(file);
    });
  }
  const tipForm = document.getElementById("tipForm");
  if (tipForm) {
    tipForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("tipName").value.trim();
      const text = document.getElementById("tipText").value.trim();
      const card = document.createElement("article");
      card.className = "d-flex gap-3 align-items-start p-3 border rounded-3";
      const avatar = document.createElement("div");
      avatar.className =
        "d-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success fw-bold flex-shrink-0 p-2";
      avatar.textContent = name.charAt(0).toUpperCase();
      const content = document.createElement("div");
      const heading = document.createElement("h3");
      heading.className = "h6 mb-1";
      heading.textContent = name;
      const body = document.createElement("p");
      body.className = "mb-0";
      body.textContent = text;
      content.append(heading, body);
      if (selectedPhotoData) {
        const img = document.createElement("img");
        img.className = "img-fluid rounded-3 mt-2 w-25";
        img.src = selectedPhotoData;
        img.alt = "Photo shared with a plant parent tip";
        content.appendChild(img);
      }
      card.append(avatar, content);
      document.getElementById("tipsList").prepend(card);
      tipForm.reset();
      if (tipPreview) {
        tipPreview.src = "";
        tipPreview.classList.add("d-none");
      }
      selectedPhotoData = "";
    });
  }

  // Contact form confirmation modal. Demo only; no message is sent to a server.
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const name = document.getElementById("contactName").value.trim();
      document.getElementById("confirmationText").textContent =
        `Thanks, ${name}! Your demo form was submitted successfully. Connect a backend or form service to actually deliver messages.`;
      const modalElement = document.getElementById("confirmationModal");
      if (window.bootstrap && modalElement)
        bootstrap.Modal.getOrCreateInstance(modalElement).show();
      contactForm.reset();
    });
  }

  // Plant Specialist chat demo with basic keyword-based responses.
  const chatForm = document.getElementById("chatForm");
  if (chatForm) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.getElementById("chatInput");
      const message = input.value.trim();
      if (!message) return;
      const area = document.getElementById("chatMessages");
      const addBubble = (text, className) => {
        const bubble = document.createElement("div");
        bubble.className = `p-2 rounded-3 small ${className}`;
        bubble.textContent = text;
        area.appendChild(bubble);
      };
      addBubble(message, "align-self-end bg-success text-white");
      const lower = message.toLowerCase();
      let reply =
        "Thanks for asking! Check the plant's light and soil first, and avoid watering on a fixed schedule. For a precise diagnosis, share the plant species and what has changed.";
      if (lower.includes("water") || lower.includes("watering"))
        reply =
          "Before watering, check the top 2–5 cm of soil. If it is still damp, wait. Make sure the pot has drainage and never leave the roots sitting in water.";
      else if (lower.includes("light") || lower.includes("sun"))
        reply =
          "Many tropical houseplants prefer bright, indirect light. A few feet from a bright window is often a good start; protect leaves from harsh midday sun.";
      else if (lower.includes("yellow") || lower.includes("leaf"))
        reply =
          "Yellow leaves can have several causes, including overwatering, underwatering or natural ageing. Check soil moisture, drainage and recent light changes before changing your routine.";
      else if (
        lower.includes("pet") ||
        lower.includes("cat") ||
        lower.includes("dog")
      )
        reply =
          "Pet safety depends on the exact plant. Check a trusted veterinary or plant-safety source before bringing it home, and keep potentially toxic plants out of reach.";
      else if (lower.includes("monstera"))
        reply =
          "Monstera likes bright, indirect light, a chunky well-draining mix and watering after the top layer of soil dries. Keep it away from pets that may chew the leaves.";
      window.setTimeout(() => {
        addBubble(reply, "align-self-start bg-success-subtle");
        area.scrollTop = area.scrollHeight;
      }, 250);
      input.value = "";
      area.scrollTop = area.scrollHeight;
    });
  }
});

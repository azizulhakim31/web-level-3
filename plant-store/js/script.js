function get(id) {
  return document.getElementById(id);
}

function make(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className || "";
  element.textContent = text == null ? "" : text;
  return element;
}

function money(amount) {
  return Number(amount).toLocaleString("en-BD");
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  document.querySelectorAll(".live-clock").forEach((clock) => clock.textContent = time);
  document.querySelectorAll(".current-year").forEach((year) => year.textContent = now.getFullYear());
}

function setupCart() {
  const size = get("plantSize"), list = get("cartItems"), addButton = get("addToCart");
  const addOns = document.querySelectorAll(".addon-check");
  const savedItems = sessionStorage.getItem("bloomingCartItems");
  let items = savedItems ? JSON.parse(savedItems) : [];

  if (!savedItems) {
    const oldCount = Number(sessionStorage.getItem("bloomingCartCount")) || 0;
    if (oldCount) items.push({ id: "1250-", size: "Small", addons: [], unitPrice: 1250, quantity: oldCount });
  }

  function cartCount() {
    let count = 0;
    items.forEach((item) => count += item.quantity);
    return count;
  }

  function updateBadges() {
    document.querySelectorAll(".cart-count").forEach((badge) => badge.textContent = cartCount());
    if (get("cartItemCount")) get("cartItemCount").textContent = cartCount();
  }

  function saveCart() {
    sessionStorage.setItem("bloomingCartItems", JSON.stringify(items));
    sessionStorage.setItem("bloomingCartCount", cartCount());
    updateBadges();
  }

  function button(action, text, label, item, disabled) {
    const style = action === "remove" ? "btn btn-outline-danger btn-sm ms-2" : "btn btn-outline-secondary btn-sm";
    const element = make("button", style, text);
    element.type = "button";
    element.dataset.cartAction = action;
    element.dataset.cartId = item.id;
    element.setAttribute("aria-label", label);
    element.disabled = disabled;
    return element;
  }

  function renderCart() {
    if (!list) {
      updateBadges();
      return;
    }
    list.replaceChildren();
    get("cartEmpty").classList.toggle("d-none", items.length > 0);

    items.forEach((item) => {
      const row = make("li", "list-group-item d-flex flex-wrap justify-content-between align-items-center gap-3");
      const details = make("div");
      details.append(
        make("h3", "h6 mb-1", `Monstera Deliciosa — ${item.size}`),
        make("p", "small text-muted mb-0", item.addons.join(" · ") || "No add-ons"),
        make("strong", "small", `৳${money(item.unitPrice * item.quantity)}`),
      );
      const controls = make("div", "d-flex align-items-center gap-2");
      controls.append(
        button("decrease", "−", `Decrease ${item.size} Monstera quantity`, item, item.quantity <= 1),
        make("span", "px-1", item.quantity),
        button("increase", "+", `Increase ${item.size} Monstera quantity`, item, false),
        button("remove", "Remove", `Remove ${item.size} Monstera`, item, false),
      );
      row.append(details, controls);
      list.append(row);
    });

    let subtotal = 0;
    items.forEach((item) => subtotal += item.unitPrice * item.quantity);
    get("cartSubtotal").textContent = `৳${money(subtotal)}`;
    updateBadges();
  }

  function updateTotal() {
    const base = Number(size.value);
    let extra = 0;
    addOns.forEach((addOn) => { if (addOn.checked) extra += Number(addOn.value); });
    get("plantPrice").textContent = money(base);
    get("totalPrice").textContent = money(base + extra);
  }

  renderCart();
  if (size) {
    size.addEventListener("change", updateTotal);
    addOns.forEach((addOn) => addOn.addEventListener("change", updateTotal));
    updateTotal();
  }

  if (addButton) addButton.addEventListener("click", () => {
    const plantSize = size.options[size.selectedIndex].text.split(" — ")[0];
    const selected = [];
    let extra = 0;
    addOns.forEach((addOn) => {
      if (addOn.checked) {
        selected.push(addOn);
        extra += Number(addOn.value);
      }
    });
    const names = selected.map((addOn) => document.querySelector(`label[for="${addOn.id}"]`).textContent.trim());
    const id = `${size.value}-${selected.map((addOn) => addOn.id).sort().join("-")}`;
    let item = items.find((cartItem) => cartItem.id === id);
    if (item) item.quantity++;
    else items.push({ id, size: plantSize, addons: names, unitPrice: Number(size.value) + extra, quantity: 1 });
    saveCart();
    renderCart();
    get("cartMessage").textContent = `${plantSize} Monstera added to your demo cart${names.length ? ` with ${names.join(" and ")}` : ""}.`;
  });

  if (list) list.addEventListener("click", (event) => {
    const clickedButton = event.target.closest("button[data-cart-action]");
    if (!clickedButton) return;
    const item = items.find((cartItem) => cartItem.id === clickedButton.dataset.cartId);
    if (!item) return;
    if (clickedButton.dataset.cartAction === "increase") item.quantity++;
    if (clickedButton.dataset.cartAction === "decrease") item.quantity = Math.max(1, item.quantity - 1);
    if (clickedButton.dataset.cartAction === "remove") items = items.filter((cartItem) => cartItem.id !== item.id);
    saveCart();
    renderCart();
  });

  const clearButton = get("clearCart");
  if (clearButton) clearButton.addEventListener("click", () => {
    items = [];
    saveCart();
    renderCart();
  });
}

function setupQuiz() {
  const quiz = get("plantQuiz");
  if (!quiz) return;

  quiz.addEventListener("submit", (event) => {
    event.preventDefault();
    const sunlight = get("sunlight").value, care = get("care").value, pets = get("pets").value;
    let plant = "Spider Plant", reason = "a forgiving plant with graceful, arching leaves";
    if (pets === "yes" && sunlight === "bright") {
      plant = "Parlor Palm";
      reason = "a pet-friendlier option that enjoys bright, indirect light";
    } else if (pets === "yes" && care === "easy") {
      plant = "Parlor Palm";
      reason = "a relatively easy, pet-friendlier choice for indoor spaces";
    } else if (pets === "yes") {
      plant = "Calathea";
      reason = "a pet-friendlier leafy option for indirect or lower light";
    } else if (sunlight === "low") {
      plant = "Snake Plant";
      reason = "a hardy plant that tolerates lower light";
    } else if (sunlight === "direct") {
      plant = "Aloe Vera";
      reason = "a sun-loving succulent that prefers its soil to dry between waterings";
    } else if (care === "moderate") {
      plant = "Monstera Deliciosa";
      reason = "a tropical statement plant that rewards a little attention";
    }
    get("quizResult").replaceChildren(
      make("strong", "", `Your match: ${plant} 🌱`),
      document.createElement("br"),
      make("span", "", `${reason}. Always verify pet safety for the exact plant species before bringing it home.`),
    );
  });
}

function setupTips() {
  const photo = get("tipPhoto"), preview = get("tipPreview"), form = get("tipForm");
  let photoData = "";
  if (photo) photo.addEventListener("change", () => {
    const file = photo.files[0];
    if (!file || !file.type.startsWith("image/")) {
      photoData = ""; photo.value = ""; preview.src = ""; preview.classList.add("d-none");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") return;
      photoData = reader.result; preview.src = photoData; preview.classList.remove("d-none");
    });
    reader.readAsDataURL(file);
  });

  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = get("tipName").value.trim();
    const content = make("div");
    content.append(make("h3", "h6 mb-1", name), make("p", "mb-0", get("tipText").value.trim()));
    if (photoData) {
      const image = make("img", "img-fluid rounded-3 mt-2 w-25");
      image.src = photoData;
      image.alt = "Photo shared with a plant parent tip";
      content.append(image);
    }
    const avatar = make("div", "d-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success fw-bold flex-shrink-0 p-2", name.charAt(0).toUpperCase());
    const card = make("article", "d-flex gap-3 align-items-start p-3 border rounded-3");
    card.append(avatar, content);
    get("tipsList").prepend(card);
    form.reset();
    preview.src = ""; preview.classList.add("d-none"); photoData = "";
  });
}

function setupContact() {
  const form = get("contactForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    get("confirmationText").textContent = `Thanks, ${get("contactName").value.trim()}! Your demo form was submitted successfully. Connect a backend or form service to actually deliver messages.`;
    const modal = get("confirmationModal");
    if (window.bootstrap && modal) bootstrap.Modal.getOrCreateInstance(modal).show();
    form.reset();
  });
}

function setupChat() {
  const form = get("chatForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = get("chatInput"), message = input.value.trim();
    if (!message) return;
    const lower = message.toLowerCase();
    let reply = "Thanks for asking! Check the plant's light and soil first, and avoid watering on a fixed schedule. For a precise diagnosis, share the plant species and what has changed.";
    if (lower.includes("water")) reply = "Before watering, check the top 2–5 cm of soil. If it is still damp, wait. Make sure the pot has drainage and never leave the roots sitting in water.";
    else if (lower.includes("light") || lower.includes("sun")) reply = "Many tropical houseplants prefer bright, indirect light. A few feet from a bright window is often a good start; protect leaves from harsh midday sun.";
    else if (lower.includes("yellow") || lower.includes("leaf")) reply = "Yellow leaves can have several causes, including overwatering, underwatering or natural ageing. Check soil moisture, drainage and recent light changes before changing your routine.";
    else if (lower.includes("pet") || lower.includes("cat") || lower.includes("dog")) reply = "Pet safety depends on the exact plant. Check a trusted veterinary or plant-safety source before bringing it home, and keep potentially toxic plants out of reach.";
    else if (lower.includes("monstera")) reply = "Monstera likes bright, indirect light, a chunky well-draining mix and watering after the top layer of soil dries. Keep it away from pets that may chew the leaves.";

    const messages = get("chatMessages");
    messages.append(make("div", "p-2 rounded-3 small align-self-end bg-success text-white", message));
    input.value = "";
    setTimeout(() => {
      messages.append(make("div", "p-2 rounded-3 small align-self-start bg-success-subtle", reply));
      messages.scrollTop = messages.scrollHeight;
    }, 250);
    messages.scrollTop = messages.scrollHeight;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  setupCart();
  setupQuiz();
  setupTips();
  setupContact();
  setupChat();
});
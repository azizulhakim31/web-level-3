"use strict";

function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $all(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

function updateFooterYear() {
  const year = new Date().getFullYear();
  $all(".current-year").forEach((item) => {
    item.textContent = year;
  });
}

function updateLiveClock() {
  const now = new Date();
  const dateText = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
  });
  const timeText = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
  });

  $all(".live-date").forEach((date) => {
    date.textContent = dateText;
    date.dateTime = now.toISOString();
  });
  $all(".live-time").forEach((time) => {
    time.textContent = timeText;
    time.dateTime = now.toISOString();
  });
}

function markCurrentNavigationLink() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  $all(".navbar .nav-link").forEach((link) => {
    const active = link.getAttribute("href") === currentFile;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function setupProjectFilters() {
  const list = $("#project-list");
  const search = $("#project-search");
  const buttons = $all("[data-filter]");
  const projects = $all(".project-item");
  if (!list || projects.length === 0) return;

  let activeFilter = "all";
  function filterProjects() {
    const query = search ? search.value.trim().toLowerCase() : "";
    let visible = 0;
    projects.forEach((project) => {
      const category = project.dataset.category || "";
      const text = (project.dataset.search || project.textContent).toLowerCase();
      const matches = (activeFilter === "all" || category === activeFilter)
        && text.includes(query);
      project.classList.toggle("d-none", !matches);
      if (matches) visible += 1;
    });
    const message = $("#project-message");
    if (message) {
      if (visible === 0) message.textContent = "No projects match your search.";
      else if (visible === projects.length) message.textContent = "Showing all projects.";
      else message.textContent = `Showing ${visible} of ${projects.length} projects.`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      filterProjects();
    });
  });
  if (search) search.addEventListener("input", filterProjects);
  filterProjects();
}

function setupContactForm() {
  const form = $("#contact-form");
  const status = $("#form-message");
  if (!form) return;

  const fields = [$("#name", form), $("#email", form),
  $("#subject", form), $("#message", form)];
  function validate(field) {
    if (!field) return true;
    const valid = field.checkValidity();
    field.classList.toggle("is-valid", valid);
    field.classList.toggle("is-invalid", !valid);
    return valid;
  }
  function setStatus(message, success) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("text-success", success);
    status.classList.toggle("text-danger", !success);
  }

  fields.forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => {
      if (field.classList.contains("is-valid") || field.classList.contains("is-invalid")) {
        validate(field);
      }
    });
    field.addEventListener("blur", () => {
      if (field.value.trim()) validate(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = fields.map(validate).every(Boolean);
    if (!valid) {
      setStatus("Please correct the highlighted fields and try again.", false);
      const firstInvalid = $(".is-invalid", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    setStatus("Validation successful! This demo does not send or save your message.", true);
    form.reset();
    fields.forEach((field) => {
      if (field) field.classList.remove("is-valid", "is-invalid");
    });
  });
}

function secureExternalLinks() {
  $all('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
    rel.add("noopener");
    rel.add("noreferrer");
    link.setAttribute("rel", Array.from(rel).join(" "));
  });
}

function setupAccessibility() {
  $all("button").forEach((button) => {
    if (!button.getAttribute("type")) button.setAttribute("type", "button");
  });
  $all("img").forEach((image) => {
    if (!image.hasAttribute("loading")) image.setAttribute("loading", "lazy");
  });
}

function initializePortfolio() {
  updateFooterYear();
  updateLiveClock();
  setupProjectFilters();
  setupContactForm();
  secureExternalLinks();
  markCurrentNavigationLink();
  setupAccessibility();
  window.setInterval(updateLiveClock, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio);
} else {
  initializePortfolio();
}

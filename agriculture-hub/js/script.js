
"use strict";

// Show live date and time
function updateClock() {
    const now = new Date();
    const dateElement = document.getElementById("liveDate");
    const timeElement = document.getElementById("liveTime");
    const footerTimeElement = document.getElementById("footerLiveTime");
    const yearElement = document.getElementById("currentYear");

    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString("en-BD", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }

    if (timeElement) {
        const currentTime = now.toLocaleTimeString("en-BD", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });
        timeElement.textContent = currentTime;

        if (footerTimeElement) {
            footerTimeElement.textContent = currentTime;
        }
    }

    if (yearElement) {
        yearElement.textContent = now.getFullYear();
    }
}

updateClock();
setInterval(updateClock, 1000);

// Filter guides or crops by search and category
function setupFilter(searchId, categoryId, itemClass, emptyId) {
    const search = document.getElementById(searchId);
    const category = document.getElementById(categoryId);
    const emptyMessage = document.getElementById(emptyId);
    const items = document.querySelectorAll("." + itemClass);

    if (!search || !category) return;

    function filterItems() {
        const keyword = search.value.toLowerCase().trim();
        const selectedCategory = category.value;
        let visibleCount = 0;

        items.forEach(function (item) {
            const text = item.textContent.toLowerCase();
            const itemCategory = item.dataset.category;

            const matchesText = text.includes(keyword);
            const matchesCategory =
                selectedCategory === "all" ||
                itemCategory === selectedCategory;

            const visible = matchesText && matchesCategory;
            item.classList.toggle("d-none", !visible);

            if (visible) visibleCount++;
        });

        if (emptyMessage) {
            emptyMessage.classList.toggle("d-none", visibleCount > 0);
        }
    }

    search.addEventListener("input", filterItems);
    category.addEventListener("change", filterItems);
}

setupFilter(
    "guideSearch",
    "guideCategory",
    "guide-item",
    "guideEmpty"
);

setupFilter(
    "cropSearch",
    "cropCategory",
    "crop-item",
    "cropEmpty"
);

// Validate contact form
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const expertise = document.getElementById("expertise").value;
        const message = document.getElementById("message").value.trim();
        const attachment = document.getElementById("attachment").files[0];
        const output = document.getElementById("formMessage");

        output.className = "mt-3 mb-0";

        if (!name || !email || !expertise || !message) {
            output.textContent = "Please complete all required fields.";
            output.classList.add("text-danger");
            return;
        }

        if (attachment && attachment.size > 5 * 1024 * 1024) {
            output.textContent = "The attachment must be 5 MB or smaller.";
            output.classList.add("text-danger");
            return;
        }

        output.textContent =
            "Form validated successfully! Connect a backend to send your inquiry.";
        output.classList.add("text-success");
    });
}

document.addEventListener('DOMContentLoaded', function () {
  updateClocks();
  window.setInterval(updateClocks, 1000);
  setupDocumentSearch();
  setupDocumentDetails();
  setupGallery();
  setupContactForm();
});
function updateClocks() {
  const now = new Date();
  const value = now.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.querySelectorAll('[data-live-clock]').forEach(function (clock) {
    clock.textContent = value;
  });
}
function setupDocumentSearch() {
  const search = document.getElementById('documentSearch');
  const type = document.getElementById('documentType');
  const cards = Array.from(document.querySelectorAll('.document-item'));
  const empty = document.getElementById('noDocuments');
  if (!search || !type) return;
  function filterDocuments() {
    const query = search.value.trim().toLowerCase();
    const selectedType = type.value;
    let visible = 0;
    cards.forEach(function (card) {
      const words = (card.dataset.search + ' ' + card.textContent).toLowerCase();
      const matchesText = words.includes(query);
      const matchesType = selectedType === 'all' || card.dataset.type === selectedType;
      const show = matchesText && matchesType;
      card.classList.toggle('d-none', !show);
      if (show) visible += 1;
    });
    if (empty) empty.classList.toggle('d-none', visible > 0);
  }
  search.addEventListener('input', filterDocuments);
  type.addEventListener('change', filterDocuments);
}
function setupDocumentDetails() {
  const modalElement = document.getElementById('detailModal');
  if (!modalElement) return;
  const modal = new bootstrap.Modal(modalElement);
  document.querySelectorAll('[data-detail]').forEach(function (button) {
    button.addEventListener('click', function () {
      const parts = button.dataset.detail.split('|');
      document.getElementById('detailTitle').textContent = parts[0] || 'Document details';
      document.getElementById('detailMeta').textContent =
        (parts[1] || 'Record') + ' • ' + (parts[2] || 'Date not specified');
      document.getElementById('detailDescription').textContent =
        parts.slice(3).join('|') || 'No description is available.';
      modal.show();
    });
  });
}
function setupGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  if (filterButtons.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterButtons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        const filter = button.dataset.filter;
        items.forEach(function (item) {
          const show = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('d-none', !show);
        });
      });
    });
  }
}
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const message = document.getElementById('formMessage');
  const fileInput = document.getElementById('attachment');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
    let valid = form.checkValidity();
    if (fileInput && fileInput.files.length) {
      const file = fileInput.files[0];
      const maxSize = 10 * 1024 * 1024;
      const allowed = /\.(pdf|jpe?g|png|webp|docx?)$/i.test(file.name);
      if (file.size > maxSize || !allowed) {
        fileInput.setCustomValidity('Choose a supported file smaller than 10 MB.');
        valid = false;
      } else {
        fileInput.setCustomValidity('');
      }
    }
    form.classList.add('was-validated');
    if (!valid) {
      if (message) {
        message.className = 'alert alert-danger mt-3';
        message.textContent = 'Please review the highlighted fields and attachment.';
      }
      return;
    }
    const name = document.getElementById('name').value.trim();
    if (message) {
      message.className = 'alert alert-success mt-3';
      message.textContent = 'Thank you, ' + name + '. Your form is valid, but submissions are not currently sent or saved.';
    }
    form.reset();
    form.classList.remove('was-validated');
  });
  if (fileInput) {
    fileInput.addEventListener('change', function () {
      fileInput.setCustomValidity('');
    });
  }
}

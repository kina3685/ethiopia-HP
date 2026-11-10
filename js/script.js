(function () {
  const modal = document.getElementById("spotModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const closeButton = document.getElementById("modalClose");
  const cards = document.querySelectorAll(".spot-card");

  let lastFocusedElement = null;

  function openModal(card) {
    lastFocusedElement = card;
    modalImage.src = card.dataset.image;
    modalImage.alt = card.dataset.title;
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;

    modal.hidden = false;
    document.body.classList.add("modal-open");
    closeButton.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  const couponButtons = document.querySelectorAll(".coupon-card__code");
  couponButtons.forEach((button) => {
    const textEl = button.querySelector(".coupon-card__code-text");
    const originalLabel = textEl.textContent;
    let resetTimer = null;

    button.addEventListener("click", () => {
      copyText(button.dataset.code).then(
        () => {
          window.clearTimeout(resetTimer);
          button.classList.add("is-copied");
          textEl.textContent = "コピーしました";
          resetTimer = window.setTimeout(() => {
            button.classList.remove("is-copied");
            textEl.textContent = originalLabel;
          }, 1500);
        },
        () => {
          textEl.textContent = "コピーに失敗しました";
          resetTimer = window.setTimeout(() => {
            textEl.textContent = originalLabel;
          }, 1500);
        }
      );
    });
  });
})();

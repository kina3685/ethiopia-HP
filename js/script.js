(function () {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  function closeNav() {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        siteNav.classList.contains("is-open") &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNav();
      }
    });
  }

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

  const planModal = document.getElementById("planModal");
  const planModalBadge = document.getElementById("planModalBadge");
  const planModalTitle = document.getElementById("planModalTitle");
  const planModalPrice = document.getElementById("planModalPrice");
  const planModalFeatures = document.getElementById("planModalFeatures");
  const planModalClose = document.getElementById("planModalClose");
  const planCard = document.getElementById("standardPlanCard");

  let lastFocusedPlanElement = null;

  function openPlanModal(card) {
    lastFocusedPlanElement = card;

    const badge = card.querySelector(".price-card__badge");
    const name = card.querySelector(".price-card__name");
    const amount = card.querySelector(".price-card__amount");
    const unit = card.querySelector(".price-card__unit");
    const features = card.querySelectorAll(".price-card__features li");

    planModalBadge.textContent = badge ? badge.textContent : "";
    planModalTitle.textContent = name ? name.textContent : "";
    planModalPrice.innerHTML = "";
    if (amount) {
      planModalPrice.appendChild(document.createTextNode(amount.textContent));
    }
    if (unit) {
      const unitSpan = document.createElement("span");
      unitSpan.textContent = unit.textContent;
      planModalPrice.appendChild(unitSpan);
    }

    planModalFeatures.innerHTML = "";
    features.forEach((li) => {
      const item = document.createElement("li");
      item.innerHTML = li.innerHTML;
      planModalFeatures.appendChild(item);
    });

    planModal.hidden = false;
    document.body.classList.add("modal-open");
    planModalClose.focus();
  }

  function closePlanModal() {
    planModal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocusedPlanElement) {
      lastFocusedPlanElement.focus();
    }
  }

  if (planCard && planModal) {
    planCard.addEventListener("click", () => openPlanModal(planCard));
    planCard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPlanModal(planCard);
      }
    });

    planModalClose.addEventListener("click", closePlanModal);

    planModal.addEventListener("click", (event) => {
      if (event.target === planModal) {
        closePlanModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !planModal.hidden) {
        closePlanModal();
      }
    });
  }

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

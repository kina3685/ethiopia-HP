(function () {
  const heroTrack = document.getElementById("heroTrack");
  if (heroTrack) {
    heroTrack.querySelectorAll("img").forEach((img) => {
      const clone = img.cloneNode(true);
      clone.removeAttribute("alt");
      clone.setAttribute("aria-hidden", "true");
      heroTrack.appendChild(clone);
    });
  }

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

  function createModalController(overlay, closeButton, { onOpen, onClose } = {}) {
    let lastFocusedElement = null;

    function open(trigger) {
      lastFocusedElement = trigger;
      if (onOpen) onOpen(trigger);
      overlay.hidden = false;
      document.body.classList.add("modal-open");
      closeButton.focus();
    }

    function close() {
      overlay.hidden = true;
      document.body.classList.remove("modal-open");
      if (onClose) onClose();
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    closeButton.addEventListener("click", close);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) {
        close();
      }
    });

    return { open, close };
  }

  function bindTrigger(trigger, open) {
    trigger.addEventListener("click", () => open(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(trigger);
      }
    });
  }

  const modal = document.getElementById("spotModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalMapWrap = document.getElementById("modalMapWrap");
  const modalMap = document.getElementById("modalMap");
  const closeButton = document.getElementById("modalClose");
  const cards = document.querySelectorAll(".spot-card");

  const SAFETY_LINK_TEXT = "「海外安全ホームページ」";
  const SAFETY_LINK_URL = "https://www.anzen.mofa.go.jp/info/pcinfectionspothazardinfo_095.html#ad-image-0";

  function appendTextWithLinks(parent, text) {
    const parts = text.split(SAFETY_LINK_TEXT);
    parts.forEach((part, index) => {
      if (part) {
        parent.appendChild(document.createTextNode(part));
      }
      if (index < parts.length - 1) {
        const link = document.createElement("a");
        link.href = SAFETY_LINK_URL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = SAFETY_LINK_TEXT;
        parent.appendChild(link);
      }
    });
  }

  function renderModalDescription(container, text) {
    container.innerHTML = "";
    const blocks = (text || "").split(/\n\s*\n/).filter((block) => block.trim() !== "");

    blocks.forEach((block) => {
      const lines = block.split("\n");
      const hasHeading = lines.length > 1;
      const heading = hasHeading ? lines[0].trim() : null;
      const body = (hasHeading ? lines.slice(1) : lines).join("\n").trim();

      if (heading) {
        const headingEl = document.createElement("span");
        headingEl.className = "modal-subheading";
        headingEl.textContent = heading;
        container.appendChild(headingEl);
      }

      if (body) {
        const bodyEl = document.createElement("p");
        appendTextWithLinks(bodyEl, body);
        container.appendChild(bodyEl);
      }
    });
  }

  const spotModalController = createModalController(modal, closeButton, {
    onOpen(card) {
      modalImage.src = card.dataset.image;
      modalImage.alt = card.dataset.title;
      modalTitle.textContent = card.dataset.title;
      renderModalDescription(modalDescription, card.dataset.description);

      if (card.dataset.map) {
        modalMap.src = `https://www.google.com/maps?q=${encodeURIComponent(card.dataset.map)}&output=embed`;
        modalMapWrap.hidden = false;
      } else {
        modalMap.src = "";
        modalMapWrap.hidden = true;
      }
    },
    onClose() {
      modalMap.src = "";
    },
  });

  cards.forEach((card) => bindTrigger(card, spotModalController.open));

  const planModal = document.getElementById("planModal");
  const planModalBadge = document.getElementById("planModalBadge");
  const planModalTitle = document.getElementById("planModalTitle");
  const planModalPrice = document.getElementById("planModalPrice");
  const planModalFeatures = document.getElementById("planModalFeatures");
  const planModalClose = document.getElementById("planModalClose");
  const planCards = document.querySelectorAll(".price-card");

  if (planCards.length && planModal) {
    const planModalController = createModalController(planModal, planModalClose, {
      onOpen(card) {
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
      },
    });

    planCards.forEach((card) => bindTrigger(card, planModalController.open));
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

  function formatYearMonth(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}${month}`;
  }

  function formatMonthEndLabel(date) {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return `${lastDay.getFullYear()}年${lastDay.getMonth() + 1}月${lastDay.getDate()}日`;
  }

  const now = new Date();
  const currentYearMonth = formatYearMonth(now);
  const currentMonthEndLabel = formatMonthEndLabel(now);

  const couponButtons = document.querySelectorAll(".coupon-card__code");
  couponButtons.forEach((button) => {
    const textEl = button.querySelector(".coupon-card__code-text");

    const baseCode = button.dataset.code;
    const monthlyCode = `${baseCode}-${currentYearMonth}`;
    button.dataset.code = monthlyCode;
    textEl.textContent = `CODE: ${monthlyCode}`;

    const card = button.closest(".coupon-card");
    const expiryEl = card ? card.querySelector(".coupon-card__expiry") : null;
    if (expiryEl) {
      expiryEl.textContent = `有効期限：${currentMonthEndLabel}まで`;
    }

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

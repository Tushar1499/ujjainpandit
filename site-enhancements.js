(function () {
  const SITE = {
    phoneDisplay: "+91 62636 35078",
    telHref: "tel:+916263635078",
    whatsappHref: "https://wa.me/916263635078?text=Hi%2C%20I%20want%20to%20book%20a%20puja.",
    conversionId: "AW-18195829513/ja8cCXTRmdEcEImmueRD",
    sourcePageFallback: "index.html",
  };

  function reportConversion(url) {
    const callback = function () {
      if (typeof url !== "undefined") {
        window.location = url;
      }
    };

    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: SITE.conversionId,
        value: 1.0,
        currency: "INR",
        event_callback: callback,
      });
      return false;
    }

    callback();
    return false;
  }

  window.gtag_report_conversion = reportConversion;

  function createTopCallBar() {
    if (!document.body || document.querySelector(".site-top-callbar")) {
      return;
    }

    const bar = document.createElement("div");
    bar.className = "site-top-callbar";
    bar.innerHTML =
      '<div class="site-top-callbar__content">' +
      '<p class="site-top-callbar__eyebrow">Direct Assistance</p>' +
      '<p class="site-top-callbar__title">Pandit Ji se baat karke turant puja booking karein</p>' +
      "</div>" +
      '<a class="site-top-callbar__button" href="' +
      SITE.telHref +
      '">Call Now</a>';

    const button = bar.querySelector("a");
    if (button) {
      button.setAttribute("onclick", "return gtag_report_conversion('" + SITE.telHref + "');");
      button.setAttribute("aria-label", "Call Pandit Ji on " + SITE.phoneDisplay);
    }

    document.body.prepend(bar);
    document.body.classList.add("site-has-mobile-callbar");
  }

  function normalizeWhatsAppButtons() {
    const waLinks = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
    let primaryLink = waLinks[0] || null;

    waLinks.slice(1).forEach(function (duplicate) {
      duplicate.remove();
    });

    if (!primaryLink) {
      primaryLink = document.createElement("a");
      document.body.appendChild(primaryLink);
    }

    primaryLink.href = SITE.whatsappHref;
    primaryLink.target = "_blank";
    primaryLink.rel = "noopener noreferrer";
    primaryLink.className = "site-whatsapp-fab";
    primaryLink.setAttribute("aria-label", "Chat on WhatsApp");

    if (!primaryLink.querySelector("img")) {
      primaryLink.innerHTML = '<span class="site-whatsapp-fab__text">WA</span>';
    }
  }

  function replaceOmLogos() {
    document.querySelectorAll('img[alt="Om Symbol"]').forEach(function (img) {
      img.src = "./image/om-logo.svg";
      img.alt = "Om Symbol";
      img.loading = "eager";
      img.decoding = "async";
    });
  }

  function wireCallLinks() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) {
        return;
      }

      link.setAttribute("onclick", "return gtag_report_conversion('" + href + "');");

      if (!link.getAttribute("aria-label")) {
        const label = (link.textContent || "Call now").trim().replace(/\s+/g, " ");
        link.setAttribute("aria-label", (label || "Call now") + " on " + SITE.phoneDisplay);
      }
    });
  }

  function setupMenuToggle() {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuBtn || !mobileMenu || menuBtn.dataset.siteBound === "true") {
      return;
    }

    menuBtn.dataset.siteBound = "true";
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  function getSourcePage() {
    const path = window.location.pathname.split("/").pop();
    return path || SITE.sourcePageFallback;
  }

  function normalizeMobile(value) {
    let digits = (value || "").replace(/\D+/g, "");
    if (digits.length > 10 && digits.startsWith("91")) {
      digits = digits.slice(-10);
    }
    return digits;
  }

  function ensureMessageContainer(form) {
    let container = form.querySelector(".site-form-message");
    if (!container) {
      container = document.createElement("div");
      container.className = "site-form-message";
      container.hidden = true;
      form.prepend(container);
    }
    return container;
  }

  function showFormMessage(form, type, message) {
    const container = ensureMessageContainer(form);
    container.hidden = false;
    container.className = "site-form-message site-form-message--" + type;
    container.textContent = message;
  }

  function validateLeadForm(form) {
    const nameField = form.querySelector('input[name="name"]');
    const mobileField = form.querySelector('input[name="mobile"]');
    const emailField = form.querySelector('input[name="email"]');
    const pujaField = form.querySelector('select[name="puja"]');

    if (!nameField || !mobileField || !emailField || !pujaField) {
      return false;
    }

    const name = nameField.value.trim();
    const mobile = normalizeMobile(mobileField.value);
    const email = emailField.value.trim();
    const puja = pujaField.value.trim();
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 2) {
      showFormMessage(form, "error", "Please enter your full name.");
      nameField.focus();
      return false;
    }

    if (mobile.length !== 10) {
      showFormMessage(form, "error", "Please enter a valid 10-digit mobile number.");
      mobileField.focus();
      return false;
    }

    if (!emailIsValid) {
      showFormMessage(form, "error", "Please enter a valid email address.");
      emailField.focus();
      return false;
    }

    if (!puja) {
      showFormMessage(form, "error", "Please select the puja you want to book.");
      pujaField.focus();
      return false;
    }

    mobileField.value = mobile;
    return true;
  }

  function showToast(type, message) {
    if (!message) {
      return;
    }

    const existing = document.querySelector(".site-status-toast");
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement("div");
    toast.className = "site-status-toast site-status-toast--" + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(function () {
      toast.remove();
    }, 5000);
  }

  async function submitLeadForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    formData.set("source_page", getSourcePage());
    form.classList.add("site-form-loading");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent || "Submit";
      submitButton.textContent = "Submitting...";
    }

    try {
      const response = await fetch("process_form.php", {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "We could not submit your form right now.");
      }

      showFormMessage(form, "success", data.message);
      showToast("success", data.message);
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while sending your request.";
      showFormMessage(form, "error", message);
      showToast("error", message);
    } finally {
      form.classList.remove("site-form-loading");
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || "Submit";
      }
    }
  }

  function enhanceForms() {
    const forms = Array.from(document.querySelectorAll("form")).filter(function (form) {
      return (
        form.querySelector('input[name="name"]') &&
        form.querySelector('input[name="mobile"]') &&
        form.querySelector('input[name="email"]') &&
        form.querySelector('select[name="puja"]')
      );
    });

    forms.forEach(function (form) {
      const nameField = form.querySelector('input[name="name"]');
      const mobileField = form.querySelector('input[name="mobile"]');
      const emailField = form.querySelector('input[name="email"]');
      const pujaField = form.querySelector('select[name="puja"]');

      form.removeAttribute("onsubmit");
      form.onsubmit = null;
      form.setAttribute("action", "process_form.php");
      form.setAttribute("method", "POST");

      nameField.required = true;
      mobileField.required = true;
      mobileField.setAttribute("inputmode", "numeric");
      mobileField.setAttribute("pattern", "[0-9]{10}");
      emailField.required = true;
      pujaField.required = true;

      if (!form.querySelector('input[name="source_page"]')) {
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "source_page";
        hidden.value = getSourcePage();
        form.appendChild(hidden);
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!validateLeadForm(form)) {
          return;
        }
        submitLeadForm(form);
      });
    });
  }

  function applyStatusFromUrl() {
    const url = new URL(window.location.href);
    const status = url.searchParams.get("status");
    const message = url.searchParams.get("message");

    if (!status || !message) {
      return;
    }

    showToast(status === "success" ? "success" : "error", message);
    url.searchParams.delete("status");
    url.searchParams.delete("message");
    window.history.replaceState({}, document.title, url.toString());
  }

  function init() {
    createTopCallBar();
    normalizeWhatsAppButtons();
    replaceOmLogos();
    wireCallLinks();
    setupMenuToggle();
    enhanceForms();
    applyStatusFromUrl();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

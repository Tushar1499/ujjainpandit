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
      '<p class="site-top-callbar__eyebrow">सीधा मार्गदर्शन</p>' +
      '<p class="site-top-callbar__title">पूजा की जानकारी के लिए पंडित जी से बात करें</p>' +
      "</div>" +
      '<a class="site-top-callbar__button" href="' +
      SITE.telHref +
      '">कॉल करें</a>';

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
    const isHomepage = document.body.classList.contains("home-page");
    let primaryLink = document.querySelector(".site-whatsapp-fab");

    if (!isHomepage) {
      const floatingCandidates = waLinks.filter(function (link) {
        const classes = link.className || "";
        return classes.includes("fixed") || classes.includes("site-whatsapp-fab");
      });
      primaryLink = primaryLink || floatingCandidates[0] || null;
      floatingCandidates.forEach(function (duplicate) {
        if (duplicate !== primaryLink) {
          duplicate.remove();
        }
      });
    }

    if (!primaryLink) {
      primaryLink = document.createElement("a");
      document.body.appendChild(primaryLink);
    }

    primaryLink.href = SITE.whatsappHref;
    primaryLink.target = "_blank";
    primaryLink.rel = "noopener noreferrer";
    primaryLink.className = "site-whatsapp-fab";
    primaryLink.setAttribute("aria-label", "Chat on WhatsApp");
    primaryLink.innerHTML =
      '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
      '<path fill="currentColor" d="M19.11 17.19c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.59.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.09-.4-2.08-1.29-.77-.69-1.29-1.53-1.44-1.79-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.59-1.42-.8-1.94-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.45.07-.69.32-.24.26-.91.89-.91 2.16s.93 2.51 1.06 2.68c.13.17 1.83 2.79 4.43 3.91.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.53-.63 1.75-1.23.22-.6.22-1.12.15-1.23-.06-.11-.23-.17-.49-.3ZM16.03 3a12.8 12.8 0 0 0-10.9 19.51L3.31 29l6.64-1.74A12.8 12.8 0 1 0 16.03 3Zm0 23.45a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-3.94 1.03 1.05-3.84-.25-.4A10.65 10.65 0 1 1 16.03 26.45Z" />' +
      "</svg>";
  }

  function createFloatingCallButton() {
    if (!document.body || document.querySelector(".site-call-fab")) {
      return;
    }

    const callButton = document.createElement("a");
    callButton.className = "site-call-fab";
    callButton.href = SITE.telHref;
    callButton.setAttribute("aria-label", "Call Pandit Ji on " + SITE.phoneDisplay);
    callButton.setAttribute("title", "Call " + SITE.phoneDisplay);
    callButton.setAttribute("onclick", "return gtag_report_conversion('" + SITE.telHref + "');");
    const callLabel = document.documentElement.lang === "hi" ? "कॉल करें" : "Call";
    callButton.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />' +
      "</svg>" +
      '<span class="site-fab-label">' + callLabel + "</span>";

    document.body.appendChild(callButton);
  }

  function replaceOmLogos() {
    document.querySelectorAll('img[alt="Om Symbol"]').forEach(function (img) {
      img.src = "./image/om-logo.svg";
      img.alt = "Om Symbol";
      img.loading = "eager";
      img.decoding = "async";
    });
  }

  function addBrandNames() {
    if (document.body.classList.contains("home-page")) {
      return;
    }

    const nav = document.querySelector("body > nav");
    if (!nav) {
      return;
    }

    const logoImage = nav.querySelector('img[alt="Om Symbol"]');
    const logoLink = logoImage ? logoImage.closest("a") : null;
    if (!logoLink || logoLink.querySelector(".site-injected-brand")) {
      return;
    }

    const copy = document.createElement("span");
    copy.className = "site-injected-brand";
    const isEnglish = document.documentElement.lang === "en";
    copy.innerHTML = isEnglish
      ? "<strong>Pandit Ram Lakhan Sharma</strong><small>Vedic rituals • Ujjain</small>"
      : "<strong>पंडित राम लखन शर्मा</strong><small>वैदिक कर्मकांड विशेषज्ञ • उज्जैन</small>";
    logoLink.classList.add("site-brand-link");
    logoLink.appendChild(copy);
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
    let menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuBtn || !mobileMenu) {
      return;
    }

    // Several legacy pages bind their own toggle. Replacing the node prevents
    // two click handlers from cancelling each other out.
    const cleanButton = menuBtn.cloneNode(true);
    menuBtn.replaceWith(cleanButton);
    menuBtn = cleanButton;
    menuBtn.dataset.siteBound = "true";
    menuBtn.setAttribute("aria-controls", "mobile-menu");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      const isOpen = !mobileMenu.classList.contains("hidden");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "मेन्यू बंद करें" : "मेन्यू खोलें");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupHomepageMotion() {
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    if (!reveals.length) {
      return;
    }

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveals.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    reveals.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupHeaderState() {
    const header = document.querySelector("[data-site-header]");
    if (!header) {
      return;
    }

    const update = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setupFaq() {
    document.querySelectorAll(".faq-list details").forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (!details.open) {
          return;
        }
        document.querySelectorAll(".faq-list details").forEach(function (other) {
          if (other !== details) {
            other.open = false;
          }
        });
      });
    });
  }

  function setupCertificateLightbox() {
    const dialog = document.getElementById("certificate-lightbox");
    if (!dialog) {
      return;
    }

    const dialogImage = dialog.querySelector("img");
    const dialogTitle = document.getElementById("certificate-dialog-title");
    const closeButton = dialog.querySelector(".certificate-lightbox-close");

    const closeDialog = function () {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    };

    document.querySelectorAll("[data-certificate-src]").forEach(function (button) {
      button.addEventListener("click", function () {
        const src = button.getAttribute("data-certificate-src");
        const title = button.getAttribute("data-certificate-title") || "प्रमाणपत्र";
        if (!src || !dialogImage || !dialogTitle) {
          return;
        }

        dialogImage.src = src;
        dialogImage.alt = title;
        dialogTitle.textContent = title;

        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        } else {
          dialog.setAttribute("open", "");
        }
      });
    });

    if (closeButton) {
      closeButton.addEventListener("click", closeDialog);
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    dialog.addEventListener("close", function () {
      if (dialogImage) {
        dialogImage.removeAttribute("src");
      }
    });
  }

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
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

    const isHindi = document.documentElement.lang === "hi";

    if (name.length < 2) {
      showFormMessage(form, "error", isHindi ? "कृपया अपना पूरा नाम लिखें।" : "Please enter your full name.");
      nameField.focus();
      return false;
    }

    if (mobile.length !== 10) {
      showFormMessage(form, "error", isHindi ? "कृपया सही 10 अंकों का मोबाइल नंबर लिखें।" : "Please enter a valid 10-digit mobile number.");
      mobileField.focus();
      return false;
    }

    if (!emailIsValid) {
      showFormMessage(form, "error", isHindi ? "कृपया सही ईमेल पता लिखें।" : "Please enter a valid email address.");
      emailField.focus();
      return false;
    }

    if (!puja) {
      showFormMessage(form, "error", isHindi ? "कृपया पूजा का चयन करें।" : "Please select the puja you want to book.");
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
    const fallbackMessage = document.documentElement.lang === "hi"
      ? "अभी आपका अनुरोध नहीं भेजा जा सका। कृपया दोबारा प्रयास करें या +91-6263635078 पर कॉल करें।"
      : "We could not submit your form right now. Please try again or call +91-6263635078.";

    formData.set("source_page", getSourcePage());
    form.classList.add("site-form-loading");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent || "Submit";
      submitButton.textContent = document.documentElement.lang === "hi" ? "भेजा जा रहा है..." : "Submitting...";
    }

    try {
      let response;
      let data;

      try {
        response = await fetch("process_form.php", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: formData,
        });

        const responseText = await response.text();
        data = responseText.trim() ? JSON.parse(responseText) : null;
      } catch (requestError) {
        throw new Error(fallbackMessage);
      }

      if (!response.ok || !data || !data.success) {
        throw new Error((data && data.message) || fallbackMessage);
      }

      const successMessage = document.documentElement.lang === "hi"
        ? "धन्यवाद। आपका अनुरोध सफलतापूर्वक भेज दिया गया है।"
        : data.message;
      showFormMessage(form, "success", successMessage);
      showToast("success", successMessage);
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
    createFloatingCallButton();
    replaceOmLogos();
    addBrandNames();
    wireCallLinks();
    setupMenuToggle();
    setupHomepageMotion();
    setupHeaderState();
    setupFaq();
    setupCertificateLightbox();
    setCurrentYear();
    enhanceForms();
    applyStatusFromUrl();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

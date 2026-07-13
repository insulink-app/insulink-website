/* Insulink — theme, language, nav and reveal. No dependencies. */
(function () {
  var LANG_KEY = "insulink-lang";
  var THEME_KEY = "insulink-theme";

  function currentLang() {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === "de" || saved === "en") return saved;
    return (navigator.language || "en").toLowerCase().indexOf("de") === 0 ? "de" : "en";
  }

  function applyLang(lang) {
    var dict = (window.I18N && window.I18N[lang]) || window.I18N.en;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n")];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = dict[el.getAttribute("data-i18n-html")];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      // format: "attr:key;attr:key"
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2 && dict[p[1]] != null) el.setAttribute(p[0].trim(), dict[p[1]]);
      });
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
    var md = document.querySelector('meta[name="description"]');
    if (md && dict["meta.desc"]) md.setAttribute("content", dict["meta.desc"]);

    var flagEl = document.querySelector("[data-flag]");
    var codeEl = document.querySelector("[data-code]");
    if (flagEl) flagEl.textContent = lang === "de" ? "🇩🇪" : "🇬🇧";
    if (codeEl) codeEl.textContent = lang === "de" ? "DE" : "EN";
    localStorage.setItem(LANG_KEY, lang);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.I18N) applyLang(currentLang()); // legal pages omit the dictionary

    var langDd = document.getElementById("lang-dd");
    var langBtn = document.getElementById("lang-toggle");
    if (langDd && langBtn) {
      function closeDd() { langDd.classList.remove("open"); langBtn.setAttribute("aria-expanded", "false"); }
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = langDd.classList.toggle("open");
        langBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      langDd.querySelectorAll("[data-lang]").forEach(function (li) {
        li.addEventListener("click", function () { applyLang(li.getAttribute("data-lang")); closeDd(); });
      });
      document.addEventListener("click", function (e) { if (!langDd.contains(e.target)) closeDd(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDd(); });
    }

    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    var navToggle = document.getElementById("nav-toggle");
    var navLinks = document.getElementById("nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () { navLinks.classList.toggle("open"); });
      navLinks.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { navLinks.classList.remove("open"); });
      });
    }

    // scrollytelling: pinned phone tilts with scroll, active step lights up
    var scrolly = document.querySelector(".scrolly");
    if (scrolly) {
      var phone = scrolly.querySelector(".phone-tilt");
      var steps = scrolly.querySelectorAll(".scrolly-step");
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (phone && !reduce) {
        var ticking = false;
        function updateTilt() {
          ticking = false;
          var r = scrolly.getBoundingClientRect();
          var vh = window.innerHeight;
          // 0 when section top hits viewport center, 1 when its bottom does
          var p = (vh / 2 - r.top) / (r.height || 1);
          p = p < 0 ? 0 : p > 1 ? 1 : p;
          phone.style.setProperty("--p", p.toFixed(4));
        }
        function onScroll() {
          if (!ticking) { ticking = true; requestAnimationFrame(updateTilt); }
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateTilt();
      }

      var base = scrolly.querySelector(".shot-base");
      var top = scrolly.querySelector(".shot-top");
      var currentSrc = base && base.getAttribute("src");
      // preload the per-step screenshots so the crossfade never waits on the network
      steps.forEach(function (el) {
        var src = el.getAttribute("data-shot");
        if (src) { var im = new Image(); im.src = src; }
      });
      // crossfade: fade the next shot in on the top layer, then commit it to the base underneath
      if (top) {
        top.addEventListener("transitionend", function () {
          if (top.style.opacity === "1") { base.src = top.src; top.style.opacity = "0"; }
        });
      }
      function showShot(src) {
        if (!base || !top || !src || src === currentSrc) return;
        currentSrc = src;
        var next = new Image();
        next.onload = function () { top.src = src; top.style.opacity = "1"; };
        next.src = src;
      }

      if (steps.length && "IntersectionObserver" in window) {
        var stepIo = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            e.target.classList.toggle("active", e.isIntersecting);
            if (e.isIntersecting) showShot(e.target.getAttribute("data-shot"));
          });
        }, { rootMargin: "-45% 0px -45% 0px" });
        steps.forEach(function (el) { stepIo.observe(el); });
      } else {
        steps.forEach(function (el) { el.classList.add("active"); });
      }
    }

    // scroll reveal
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && reveals.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in-view"); });
    }
  });
})();

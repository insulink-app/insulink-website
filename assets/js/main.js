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

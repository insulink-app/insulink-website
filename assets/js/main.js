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
    syncDemo();
  }

  /** The hero demo follows the page: main_demo.dart adopts ?lang= and ?theme=,
      and ?frame= is the corner radius the app clips itself to (style.css).
      A change reloads it, which the demo's splash covers. The demo is not part
      of this site: the app's CI publishes it to the URL in data-src (point that
      at a local `flutter build web` output to preview a change). It starts
      only after the page itself has loaded, so the app's engine never competes
      with the page's own first paint. */
  function syncDemo() {
    var frame = document.querySelector(".demo-frame");
    if (!frame) {
      return;
    }
    if (document.readyState !== "complete") {
      window.addEventListener("load", syncDemo, { once: true });
      return;
    }
    var root = document.documentElement;
    var radius = parseInt(getComputedStyle(frame).getPropertyValue("--screen-radius"), 10);
    var src = frame.getAttribute("data-src") + "?frame=" + radius + "&lang=" + root.lang + "&theme=" + root.getAttribute("data-theme");
    if (frame.getAttribute("src") !== src) {
      frame.setAttribute("src", src);
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    syncDemo();
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

    // header: transparent over the hero at the very top, the regular one once scrolled
    var header = document.querySelector(".site-header.on-hero");
    if (header) {
      var onScrollHeader = function () {
        header.classList.toggle("on-hero", window.scrollY < 16);
      };
      window.addEventListener("scroll", onScrollHeader, { passive: true });
      onScrollHeader();
    }

    // screenshot strip arrows: page by most of the visible width
    var gallery = document.querySelector(".gallery");
    if (gallery) {
      [["gallery-prev", -1], ["gallery-next", 1]].forEach(function (pair) {
        document.querySelector("." + pair[0]).addEventListener("click", function () {
          gallery.scrollBy({ left: pair[1] * gallery.clientWidth * 0.8, behavior: "smooth" });
        });
      });
    }

    // screenshot lightbox: the dialog track holds every full-size screenshot (the
    // thumbnail's link target), one per snap page, loaded only when paged to
    var lightbox = document.querySelector(".lightbox");
    if (lightbox && lightbox.showModal) {
      var track = lightbox.querySelector(".lightbox-track");
      var thumbs = document.querySelectorAll(".gallery a");
      thumbs.forEach(function (link, index) {
        var full = document.createElement("img");
        full.src = link.href;
        full.alt = link.querySelector("img").alt;
        full.loading = "lazy";
        track.appendChild(full);
        link.addEventListener("click", function (event) {
          event.preventDefault();
          lightbox.showModal();
          track.scrollTo({ left: index * track.clientWidth, behavior: "instant" });
        });
      });
      function page(direction) {
        track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
      }
      lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { page(-1); });
      lightbox.querySelector(".lightbox-next").addEventListener("click", function () { page(1); });
      lightbox.querySelector(".lightbox-close").addEventListener("click", function () { lightbox.close(); });
      lightbox.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") { event.preventDefault(); page(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); page(1); }
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

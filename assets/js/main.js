/* Insulink: theme, language and reveal. No dependencies. */
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

    var codeEl = document.querySelector("[data-code]");
    if (codeEl) codeEl.textContent = lang === "de" ? "DE" : "EN";
    localStorage.setItem(LANG_KEY, lang);
    labelTheme();
    syncDemo();
    syncScreens();
  }

  /** The screens are the app's own screenshots, published by its CI next to
      the demo for every language and theme (insulink-app docs/SCREENSHOTS.md);
      like the demo they follow the page's language and theme. */
  function syncScreens() {
    var strip = document.querySelector(".strip");
    if (!strip) return;
    var root = document.documentElement;
    var folder = strip.getAttribute("data-shots") + root.lang + "-" + root.getAttribute("data-theme") + "/";
    document.querySelectorAll("[data-shot]").forEach(function (el) {
      var url = folder + el.getAttribute("data-shot") + ".png";
      el.setAttribute(el.tagName === "A" ? "href" : "src", url);
    });
  }

  /** A screen the app has not published (yet) leaves the strip instead of
      showing a broken picture; it returns once a language or theme has it. */
  function hideMissingScreens() {
    document.querySelectorAll(".strip img").forEach(function (img) {
      var figure = img.closest("figure");
      img.addEventListener("error", function () { figure.hidden = true; });
      img.addEventListener("load", function () { figure.hidden = false; });
    });
  }

  /** The theme button names what it switches to, in the page's language
      (legal pages have no dictionary and keep the English label). */
  function labelTheme() {
    var btn = document.getElementById("theme-toggle");
    var dict = window.I18N && window.I18N[document.documentElement.lang];
    if (!btn || !dict) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-label", dict[dark ? "nav.theme_light" : "nav.theme_dark"]);
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
    labelTheme();
    syncDemo();
    syncScreens();
  }

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Animates an item's height from `from` to `to`, then runs `done`.
      A click during the slide is ignored (data-sliding). */
  function slide(item, from, to, done) {
    item.setAttribute("data-sliding", "");
    item.style.overflow = "hidden";
    var motion = item.animate(
      { height: [from + "px", to + "px"] },
      { duration: reducedMotion.matches ? 0 : 280, easing: "ease" }
    );
    motion.onfinish = function () {
      item.style.overflow = "";
      item.removeAttribute("data-sliding");
      if (done) done();
    };
  }

  function closeItem(item) {
    slide(item, item.offsetHeight, item.querySelector("summary").offsetHeight, function () { item.open = false; });
  }

  function openItem(item) {
    var closed = item.offsetHeight;
    item.open = true;
    slide(item, closed, item.offsetHeight);
  }

  function faqAccordion(items) {
    items.forEach(function (item) {
      item.querySelector("summary").addEventListener("click", function (event) {
        event.preventDefault();
        if (item.hasAttribute("data-sliding")) return;
        if (item.open) {
          closeItem(item);
          return;
        }
        items.forEach(function (other) { if (other.open) closeItem(other); });
        openItem(item);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    hideMissingScreens();
    if (window.I18N) applyLang(currentLang()); // legal pages omit the dictionary

    var langBtn = document.getElementById("lang-toggle");
    if (langBtn) langBtn.addEventListener("click", function () {
      applyLang(document.documentElement.lang === "de" ? "en" : "de");
    });

    var themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });

    // screens strip: arrows page by most of the visible width, the dots and the
    // disabled arrow follow the scroll position
    var strip = document.querySelector(".strip");
    if (strip) {
      var prev = document.querySelector(".strip-prev");
      var next = document.querySelector(".strip-next");
      var dots = document.querySelectorAll(".strip-dots i");
      prev.addEventListener("click", function () { strip.scrollBy({ left: -strip.clientWidth * 0.8, behavior: "smooth" }); });
      next.addEventListener("click", function () { strip.scrollBy({ left: strip.clientWidth * 0.8, behavior: "smooth" }); });
      var syncStrip = function () {
        var range = strip.scrollWidth - strip.clientWidth;
        var progress = range > 0 ? strip.scrollLeft / range : 0;
        var active = Math.round(progress * (dots.length - 1));
        dots.forEach(function (dot, index) { dot.classList.toggle("active", index === active); });
        prev.disabled = strip.scrollLeft <= 1;
        next.disabled = strip.scrollLeft >= range - 1;
      };
      strip.addEventListener("scroll", syncStrip, { passive: true });
      window.addEventListener("resize", syncStrip);
      syncStrip();
    }

    // screenshot lightbox: the dialog track holds every full-size screenshot (the
    // thumbnail's link target), one per snap page, loaded only when paged to
    var lightbox = document.querySelector(".lightbox");
    if (lightbox && lightbox.showModal) {
      var track = lightbox.querySelector(".lightbox-track");
      var thumbs = document.querySelectorAll(".strip a");
      thumbs.forEach(function (link, index) {
        var full = document.createElement("img");
        full.setAttribute("data-shot", link.getAttribute("data-shot"));
        full.src = link.href;
        full.alt = link.querySelector("img").alt;
        full.setAttribute("data-i18n-attr", link.querySelector("img").getAttribute("data-i18n-attr"));
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

    // ecosystem data flow: animate only while it can be seen
    var flow = document.querySelector(".flow");
    if (flow && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        flow.classList.toggle("flow-live", entries[0].isIntersecting);
      }).observe(flow);
    }

    // FAQ: one answer open at a time, opening and closing slide (instant with
    // reduced motion); the height is animated because <details> cannot be
    faqAccordion(document.querySelectorAll(".faq details"));

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

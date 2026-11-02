/* Orange Bar — логіка сторінки. Дані беруться з menu.js (window.SITE).
   Безпека: увесь текст вставляється через textContent (без innerHTML),
   посилання приймаються лише https, телефон — лише цифри та «+». */
(function () {
  "use strict";

  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = String(text);
    return n;
  }
  function safeUrl(u) {
    try { var x = new URL(String(u)); return x.protocol === "https:" ? x.href : null; }
    catch (e) { return null; }
  }
  function safePath(p) {            // лише локальні файли з папки img/
    p = String(p || "");
    return /^img\/[a-z0-9._-]+\.(jpe?g|png|webp|avif)$/i.test(p) ? p : null;
  }

  /* ---------- мобільне меню ---------- */
  var burger = $("burger"), drawer = $("drawer"), dock = $("dock");
  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("lock", open);
    if (open) { var f = drawer.querySelector("a"); if (f) f.focus({ preventScroll: true }); }
    updateDock();
  }
  burger.addEventListener("click", function () { setDrawer(!drawer.classList.contains("open")); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a[href^='#']")) setDrawer(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) { setDrawer(false); burger.focus(); }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 960 && drawer.classList.contains("open")) setDrawer(false);
  });

  /* ---------- нижня панель: показ лише між першим екраном і контактами ---------- */
  var heroVisible = true, endVisible = false;
  function updateDock() {
    var show = !heroVisible && !endVisible && !drawer.classList.contains("open");
    dock.classList.toggle("show", show);
    dock.setAttribute("aria-hidden", show ? "false" : "true");
    dock.querySelectorAll("a").forEach(function (a) { a.tabIndex = show ? 0 : -1; });
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; updateDock(); },
      { rootMargin: "0px 0px -35% 0px" }).observe($("top"));
    var ends = {};
    var endIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { ends[e.target.id] = e.isIntersecting; });
      endVisible = !!(ends.contacts || ends.footer); updateDock();
    }, { rootMargin: "0px 0px -10% 0px" });
    endIo.observe($("contacts")); endIo.observe($("footer"));
  }
  updateDock();

  if (!S) {                        // menu.js не завантажився
    var err = el("p", "menu-error", "Меню тимчасово недоступне. Актуальне меню — в Instagram закладу.");
    $("cats").appendChild(err);
    return;
  }
  var C = S.contacts || {};

  /* ---------- посилання з menu.js ---------- */
  var links = { instagram: safeUrl(C.instagram), maps: safeUrl(C.mapsUrl), linktree: safeUrl(C.linktree) };
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var u = links[a.dataset.link]; if (u) a.href = u;
  });

  /* ---------- фото (якщо файлу немає — заглушка з іменем) ---------- */
  function placeholder(p) {
    var d = el("div", "ph");
    d.appendChild(el("span", "c")).setAttribute("aria-hidden", "true");
    d.appendChild(el("b", null, p.alt));
    d.appendChild(document.createTextNode("Додайте фото:"));
    d.appendChild(el("code", null, p.file));
    return d;
  }
  function loadPhoto(p, onOk) {
    var src = safePath(p.file); if (!src) return;
    var img = new Image();
    img.alt = String(p.alt || ""); img.decoding = "async";
    img.onload = function () { onOk(img); };
    img.src = src;
  }
  var photos = S.photos || {};
  if (photos.hero) loadPhoto(photos.hero, function (img) {
    $("heroPhoto").appendChild(img); $("top").classList.add("has-photo");
  });
  var gal = $("gal");
  (photos.gallery || []).forEach(function (p) {
    var f = el("figure", "shot");
    f.appendChild(placeholder(p));
    gal.appendChild(f);
    loadPhoto(p, function (img) {
      img.loading = "lazy";
      f.textContent = ""; f.appendChild(img); f.appendChild(el("figcaption", null, p.alt));
    });
  });

  /* ---------- меню ---------- */
  if (S.menuNote) $("menuNote").textContent = S.menuNote;
  var chips = $("chips"), cats = $("cats");
  (S.menu || []).forEach(function (cat, i) {
    var id = "cat-" + String(cat.id || i).replace(/[^a-z0-9-]/gi, "");
    var chip = el("a", i === 0 ? "on" : "", cat.title);
    chip.href = "#" + id; chip.dataset.cat = id;
    chips.appendChild(chip);

    var box = el("div", "cat"); box.id = id;
    var h = el("h3", null, cat.title);
    h.appendChild(el("small", null, (cat.items || []).length + " поз."));
    box.appendChild(h);
    var ul = el("ul", "items");
    (cat.items || []).forEach(function (it) {
      var li = el("li", "item");
      li.appendChild(el("span", "n", it.name));
      li.appendChild(el("span", "dots")).setAttribute("aria-hidden", "true");
      var p = el("span", "p", Number(it.price) || "—");
      p.appendChild(el("small", null, "грн"));
      li.appendChild(p);
      ul.appendChild(li);
    });
    box.appendChild(ul);
    cats.appendChild(box);
  });

  var chipEls = chips.querySelectorAll("a"), current = "";
  function setOn(id) {
    if (id === current) return; current = id;
    chipEls.forEach(function (a) {
      var on = a.dataset.cat === id;
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on && chips.scrollWidth > chips.clientWidth) {
        chips.scrollTo({ left: Math.max(0, a.offsetLeft - 16), behavior: "smooth" });
      }
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setOn(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    cats.querySelectorAll(".cat").forEach(function (c) { io.observe(c); });
  }

  /* ---------- контакти та години ---------- */
  if (C.address) $("addr").textContent = C.address;
  if (C.metro) $("metro").textContent = "«" + C.metro + "»";

  var today = 0;
  try {
    var wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Europe/Kyiv" }).format(new Date());
    today = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[wd] || 0;
  } catch (e) { var d = new Date().getDay(); today = d === 0 ? 7 : d; }

  var hoursUl = $("hours"), todayTime = "", footLines = [];
  (S.hours || []).forEach(function (h) {
    var on = (h.days || []).indexOf(today) > -1;
    if (on) todayTime = h.time;
    var li = el("li", on ? "today" : "");
    li.appendChild(el("span", null, h.label));
    li.appendChild(el("span", null, h.time));
    hoursUl.appendChild(li);
    footLines.push(h.label + ": " + h.time);
  });
  if (todayTime) {
    var ht = $("heroToday"); ht.textContent = "Сьогодні ";
    ht.appendChild(el("b", null, todayTime));
    $("drawerToday").textContent = "Сьогодні: " + todayTime + " (за даними публікації)";
  }

  var phoneDigits = String(C.phone || "").replace(/[^\d+]/g, "");
  if (C.phoneConfirmed === true && /^\+?\d{10,15}$/.test(phoneDigits)) {
    var box = $("phoneBox"); box.textContent = "";
    var a = el("a", "phone", C.phone); a.href = "tel:" + phoneDigits;
    box.appendChild(a);
  } else if (C.instagramHandle) {
    $("phoneBox").firstElementChild.textContent = "Пишіть в Instagram " + C.instagramHandle + ".";
  }

  var fi = $("footInfo"); fi.textContent = (C.address || "") + " · м. «" + (C.metro || "") + "»";
  footLines.forEach(function (l) { fi.appendChild(document.createElement("br")); fi.appendChild(document.createTextNode(l)); });
})();

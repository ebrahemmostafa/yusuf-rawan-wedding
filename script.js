/* =========================================================
   Edit the wedding details here.
   ========================================================= */
const CONFIG = {
  name1: "Yusuf",
  name2: "Rawan",
  // Date & time of the ceremony, Cairo time (UTC+2)
  date: "2026-11-20T16:00:00+02:00",
  time: "16:00",
  venueName: "Beau Jardin East",
  address1: "Ismailia Desert Road, El Shorouk",
  address2: "Cairo, Egypt",
  mapQuery: "5JPJ+G43 Beau Jardin East, Ismailia Desert Rd, El Shorouk, Cairo Governorate",
  mapLink: "https://maps.app.goo.gl/r3tn38XmANG3feQ18",
  maxGuests: 6,
  // RSVP delivery. The first one that is set is used:
  //  0. Supabase     – fill in supabase-config.js (see supabase/setup.sql)
  //  1. rsvpEndpoint – URL that accepts a JSON POST (e.g. https://formspree.io/f/xxxx)
  //  2. rsvpWhatsApp – phone number in international format, digits only (e.g. "201001234567")
  //  3. rsvpEmail    – opens the guest's mail app with the answers filled in
  rsvpEndpoint: "",
  rsvpWhatsApp: "",
  rsvpEmail: "",
  // Arabic version of the details above
  ar: {
    name1: "يوسف",
    name2: "روان",
    address1: "طريق مصر الإسماعيلية الصحراوي، الشروق",
    address2: "القاهرة، مصر",
    timeLine: "الساعة الرابعة مساءً",
  },
};

const I18N = {
  en: {
    "intro.hint": "Tap to open",
    "hero.kicker": "We're getting married",
    "hero.rsvp": "RSVP",
    "song.title": "Listen to our song",
    "song.play": "Play our song",
    "song.pause": "Pause our song",
    "invite.at": "At {time}",
    "invite.note": "We can't wait to celebrate our special day with you!",
    "countdown.title": "Countdown",
    "countdown.until": "Until",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "venue.title": "Our Day",
    "venue.directions": "Tap the photo for directions",
    "venue.openMaps": "Open location",
    "rsvp.title": "RSVP",
    "rsvp.subtitle": "Kindly let us know if you can join us",
    "rsvp.attending": "Will you be attending?",
    "rsvp.yes": "Yes, I'll be there",
    "rsvp.no": "Unfortunately, I can't make it",
    "rsvp.howMany": "How many guests?",
    "rsvp.person": "Person {n}",
    "rsvp.mainContact": "(Main contact)",
    "rsvp.fullName": "Full name",
    "rsvp.dietary": "Dietary requirements",
    "rsvp.dietaryPh": "e.g. vegetarian, allergies, etc.",
    "rsvp.children": "Will any children be attending?",
    "rsvp.childYes": "Yes",
    "rsvp.childNo": "No",
    "rsvp.childrenPh": "Number and ages of the children",
    "rsvp.message": "Message for the couple",
    "rsvp.messagePh": "Write something nice (optional)",
    "rsvp.submit": "Send RSVP",
    "rsvp.sending": "Sending…",
    "rsvp.errName": "Please enter a name for every guest.",
    "rsvp.errSend": "Something went wrong. Please try again.",
    "rsvp.thanksTitle": "Thank you!",
    "rsvp.thanksYes": "We can't wait to celebrate with you.",
    "rsvp.thanksNo": "We'll miss you — thank you for letting us know.",
    "msg.title": "RSVP – {couple}",
    "msg.attending": "Attending",
    "msg.guests": "Guests",
    "msg.children": "Children",
    "msg.message": "Message",
    "footer.credit": "made with love by",
  },
  ar: {
    "intro.hint": "اضغط لفتح الدعوة",
    "hero.kicker": "دعوة زفاف",
    "hero.rsvp": "تأكيد الحضور",
    "song.title": "استمعوا إلى أغنيتنا",
    "song.play": "تشغيل أغنيتنا",
    "song.pause": "إيقاف أغنيتنا",
    "invite.note": "بكل الحب ننتظركم لنحتفل معًا بيومنا المميز!",
    "countdown.title": "العد التنازلي",
    "countdown.until": "حتى",
    "countdown.days": "أيام",
    "countdown.hours": "ساعات",
    "countdown.minutes": "دقائق",
    "venue.title": "يومنا",
    "venue.directions": "اضغط على الصورة لمعرفة الطريق",
    "venue.openMaps": "افتح الموقع",
    "rsvp.title": "تأكيد الحضور",
    "rsvp.subtitle": "يسعدنا أن تخبرونا إن كنتم ستشاركوننا فرحتنا",
    "rsvp.attending": "هل ستشرفنا بالحضور؟",
    "rsvp.yes": "نعم، سأحضر",
    "rsvp.no": "للأسف، لن أتمكن من الحضور",
    "rsvp.howMany": "كم عدد الضيوف؟",
    "rsvp.person": "الضيف {n}",
    "rsvp.mainContact": "(صاحب الدعوة)",
    "rsvp.fullName": "الاسم بالكامل",
    "rsvp.dietary": "احتياجات غذائية خاصة",
    "rsvp.dietaryPh": "مثال: نباتي، حساسية من طعام معين",
    "rsvp.children": "هل سيحضر أطفال؟",
    "rsvp.childYes": "نعم",
    "rsvp.childNo": "لا",
    "rsvp.childrenPh": "عدد الأطفال وأعمارهم",
    "rsvp.message": "رسالة للعروسين",
    "rsvp.messagePh": "اكتب كلمة جميلة (اختياري)",
    "rsvp.submit": "إرسال",
    "rsvp.sending": "جارٍ الإرسال…",
    "rsvp.errName": "من فضلك اكتب اسم كل ضيف.",
    "rsvp.errSend": "حدث خطأ ما، حاول مرة أخرى.",
    "rsvp.thanksTitle": "شكرًا لك!",
    "rsvp.thanksYes": "في انتظاركم لنحتفل معًا.",
    "rsvp.thanksNo": "سنفتقدك، شكرًا لإبلاغنا.",
    "msg.title": "تأكيد الحضور – {couple}",
    "msg.attending": "الحضور",
    "msg.guests": "الضيوف",
    "msg.children": "الأطفال",
    "msg.message": "الرسالة",
    "footer.credit": "صُنع بحب بواسطة",
  },
};

const LANGS = { en: { locale: "en-GB", dir: "ltr" }, ar: { locale: "ar-EG", dir: "rtl" } };
let lang = "en";

const t = (key, vars = {}) =>
  (I18N[lang][key] ?? I18N.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const weddingDate = new Date(CONFIG.date);

/* ---------- Static content ---------- */
const formatDate = (opts) =>
  new Intl.DateTimeFormat(LANGS[lang].locale, { timeZone: "Africa/Cairo", ...opts }).format(weddingDate);

// "16:00" -> "4:00 PM"
function to12h(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function renderConfig() {
  const weekday = formatDate({ weekday: "long" });
  const values = {
    ...CONFIG,
    timeLine: t("invite.at", { time: to12h(CONFIG.time).replace(":00", "") }),
    dateLong: formatDate({ day: "numeric", month: "long", year: "numeric" }),
    dateShort: formatDate({ day: "2-digit", month: "2-digit", year: "numeric" }),
    weekday: lang === "ar" ? `يوم ${weekday}` : weekday,
    ...(lang === "ar" ? CONFIG.ar : {}),
  };
  $$("[data-cfg]").forEach((el) => (el.textContent = values[el.dataset.cfg]));
}

function setupMap() {
  const q = encodeURIComponent(CONFIG.mapQuery);
  const link = CONFIG.mapLink || `https://www.google.com/maps/search/?api=1&query=${q}`;
  $("#address-link").href = link;
  $("#photo-link").href = link;
}

function renderText() {
  $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $$("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  renderConfig();
  renderGuests();
  const music = $("#music-toggle");
  music.setAttribute("aria-label", t(music.classList.contains("playing") ? "song.pause" : "song.play"));
}

/* ---------- Language ---------- */
function setLang(next) {
  lang = LANGS[next] ? next : "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGS[lang].dir;
  $("#lang-toggle").textContent = lang === "ar" ? "EN" : "عربي";
  try { localStorage.setItem("lang", lang); } catch {}
  renderText();
}

function setupLang() {
  let saved = new URLSearchParams(location.search).get("lang");
  if (!saved) try { saved = localStorage.getItem("lang"); } catch {}
  $("#lang-toggle").addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));
  setLang(saved || "en");
}

/* ---------- Countdown ---------- */
function tick() {
  const diff = Math.max(0, weddingDate - Date.now());
  const pad = (n) => String(n).padStart(2, "0");
  $("#cd-days").textContent = pad(Math.floor(diff / 864e5));
  $("#cd-hours").textContent = pad(Math.floor(diff / 36e5) % 24);
  $("#cd-mins").textContent = pad(Math.floor(diff / 6e4) % 60);
}

/* ---------- RSVP ---------- */
let guestCount = 1;
const guestData = [];

function saveGuestInputs() {
  $$("#guests .guest").forEach((g, i) => {
    guestData[i] = {
      name: $("[name=name]", g).value,
      dietary: $("[name=dietary]", g).value,
    };
  });
}

function renderGuests() {
  saveGuestInputs();
  let html = "";
  for (let i = 0; i < guestCount; i++) {
    const d = guestData[i] || {};
    const esc = (s = "") => s.replace(/"/g, "&quot;");
    html += `<div class="guest">
      <h4>${t("rsvp.person", { n: i + 1 })} ${i === 0 ? t("rsvp.mainContact") : ""}</h4>
      <input class="field" name="name" placeholder="${t("rsvp.fullName")}" value="${esc(d.name)}" autocomplete="${i === 0 ? "name" : "off"}">
      <label>${t("rsvp.dietary")}</label>
      <input class="field" name="dietary" placeholder="${t("rsvp.dietaryPh")}" value="${esc(d.dietary)}">
    </div>`;
  }
  $("#guests").innerHTML = html;
  $("#guests-count").textContent = guestCount;
  $("#guests-minus").disabled = guestCount <= 1;
  $("#guests-plus").disabled = guestCount >= CONFIG.maxGuests;
}

function updateAttendingUI() {
  const form = $("#rsvp-form");
  const attending = form.attending.value === "yes";
  $("#attending-fields").hidden = !attending;
  $("#decline-fields").hidden = attending;
  $("#children-fields").hidden = !attending || form.children.value !== "yes";
}

function buildSummary(data) {
  const lines = [t("msg.title", { couple: `${CONFIG.name1} & ${CONFIG.name2}` }), ""];
  lines.push(`${t("msg.attending")}: ${data.attending === "yes" ? t("rsvp.yes") : t("rsvp.no")}`);
  if (data.attending === "yes") {
    lines.push(`${t("msg.guests")}: ${data.guests.length}`);
    data.guests.forEach((g, i) => {
      lines.push(`  ${i + 1}. ${g.name}${g.dietary ? ` – ${g.dietary}` : ""}`);
    });
    lines.push(`${t("msg.children")}: ${data.children === "yes" ? `${t("rsvp.childYes")} – ${data.childrenDetails}` : t("rsvp.childNo")}`);
  } else {
    lines.push(`${t("rsvp.fullName")}: ${data.name}`);
  }
  if (data.message) lines.push("", `${t("msg.message")}: ${data.message}`);
  return lines.join("\n");
}

async function submitRsvp(e) {
  e.preventDefault();
  const form = e.target;
  const err = $("#form-error");
  err.hidden = true;
  $$(".field.invalid", form).forEach((f) => f.classList.remove("invalid"));

  const attending = form.attending.value;
  const data = { attending, message: form.message.value.trim(), submittedAt: new Date().toISOString() };

  if (attending === "yes") {
    saveGuestInputs();
    data.guests = guestData.slice(0, guestCount).map((g) => ({
      name: g.name.trim(), dietary: g.dietary.trim(),
    }));
    data.children = form.children.value;
    data.childrenDetails = form.childrenDetails.value.trim();
    const missing = $$("#guests [name=name]").filter((f) => !f.value.trim());
    if (missing.length) {
      missing.forEach((f) => f.classList.add("invalid"));
      err.textContent = t("rsvp.errName");
      err.hidden = false;
      missing[0].focus();
      return;
    }
  } else {
    data.name = form.declineName.value.trim();
    if (!data.name) {
      form.declineName.classList.add("invalid");
      err.textContent = t("rsvp.errName");
      err.hidden = false;
      form.declineName.focus();
      return;
    }
  }

  const btn = $(".submit", form);
  const summary = buildSummary(data);
  try {
    if (SUPABASE.url && SUPABASE.key) {
      btn.disabled = true;
      btn.textContent = t("rsvp.sending");
      const yes = attending === "yes";
      await supabaseRequest("yusufRawanWedding", {
        attending: yes,
        name: yes ? data.guests[0].name : data.name,
        guest_count: yes ? data.guests.length : 0,
        guests: yes ? data.guests : [],
        children: yes && data.children === "yes",
        children_details: yes && data.children === "yes" ? data.childrenDetails || null : null,
        message: data.message || null,
      });
    } else if (CONFIG.rsvpEndpoint) {
      btn.disabled = true;
      btn.textContent = t("rsvp.sending");
      const res = await fetch(CONFIG.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, summary }),
      });
      if (!res.ok) throw new Error(res.status);
    } else if (CONFIG.rsvpWhatsApp) {
      window.open(`https://wa.me/${CONFIG.rsvpWhatsApp}?text=${encodeURIComponent(summary)}`, "_blank");
    } else if (CONFIG.rsvpEmail) {
      const subject = t("msg.title", { couple: `${CONFIG.name1} & ${CONFIG.name2}` });
      location.href = `mailto:${CONFIG.rsvpEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
    }
  } catch {
    err.textContent = t("rsvp.errSend");
    err.hidden = false;
    btn.disabled = false;
    btn.textContent = t("rsvp.submit");
    return;
  }

  form.hidden = true;
  $("#thanks-text").textContent = attending === "yes" ? t("rsvp.thanksYes") : t("rsvp.thanksNo");
  $("#rsvp-thanks").hidden = false;
}

function setupRsvp() {
  const form = $("#rsvp-form");
  form.addEventListener("change", updateAttendingUI);
  form.addEventListener("submit", submitRsvp);
  $("#guests-minus").addEventListener("click", () => { if (guestCount > 1) { guestCount--; renderGuests(); } });
  $("#guests-plus").addEventListener("click", () => { if (guestCount < CONFIG.maxGuests) { guestCount++; renderGuests(); } });
  updateAttendingUI();
}

/* ---------- Scroll reveal ---------- */
function setupReveal() {
  const targets = $$("section > *");
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  targets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

/* ---------- Auto scroll ---------- */
// If the guest hasn't scrolled 4 seconds after the site opens, glide down to the next section.
function autoScrollIfIdle(delay = 4000) {
  const events = ["scroll", "wheel", "touchstart", "keydown", "mousedown"];
  const cancel = () => {
    clearTimeout(timer);
    events.forEach((e) => window.removeEventListener(e, cancel));
  };
  const timer = setTimeout(() => {
    cancel();
    if (window.scrollY < 10) $(".invite").scrollIntoView({ behavior: "smooth" });
  }, delay);
  setTimeout(() => events.forEach((e) => window.addEventListener(e, cancel, { passive: true })), 0);
}

/* ---------- Envelope intro & music ---------- */
function setupIntro() {
  const intro = $("#intro");
  const video = $("#intro-video");
  const music = $("#music");
  const toggle = $("#music-toggle");
  let state = "idle";

  const setPlaying = (on) => {
    toggle.classList.toggle("playing", on);
    toggle.setAttribute("aria-pressed", on);
    toggle.setAttribute("aria-label", t(on ? "song.pause" : "song.play"));
  };
  music.volume = 0.6;
  music.addEventListener("play", () => setPlaying(true));
  music.addEventListener("pause", () => setPlaying(false));
  toggle.addEventListener("click", () => (music.paused ? music.play().catch(() => {}) : music.pause()));

  const finish = () => {
    if (state === "done") return;
    state = "done";
    intro.classList.add("fade");
    document.body.classList.remove("locked");
    setTimeout(() => intro.remove(), 800);
    autoScrollIfIdle();
  };

  intro.addEventListener("click", () => {
    if (state !== "idle") return;
    state = "playing";
    const p = video.play();
    if (p && p.catch) p.catch(finish);
  });
  video.addEventListener("timeupdate", () => {
    if (video.currentTime > 0.05) intro.classList.add("started");
    if (state === "playing" && video.duration - video.currentTime <= 0.8) finish();
  });
  video.addEventListener("ended", finish);
  video.addEventListener("error", () => state === "playing" && finish());
}

/* ---------- Init ---------- */
// Always start from the top (behind the envelope), even after a reload.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

setupMap();
setupRsvp();
setupLang();
tick();
setInterval(tick, 30000);
setupReveal();
setupIntro();

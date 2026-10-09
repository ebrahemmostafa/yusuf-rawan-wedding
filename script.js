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
  programme: [
    { time: "16:00", key: "arrival" },
    { time: "17:00", key: "ceremony" },
    { time: "17:30", key: "firstDance" },
    { time: "18:30", key: "cocktails" },
    { time: "19:00", key: "dinner" },
    { time: "21:30", key: "cake" },
    { time: "22:00", key: "finish" },
  ],
  maxGuests: 6,
  // RSVP delivery. The first one that is set is used:
  //  0. Supabase     – fill in supabase-config.js (see supabase/setup.sql)
  //  1. rsvpEndpoint – URL that accepts a JSON POST (e.g. https://formspree.io/f/xxxx)
  //  2. rsvpWhatsApp – phone number in international format, digits only (e.g. "201001234567")
  //  3. rsvpEmail    – opens the guest's mail app with the answers filled in
  rsvpEndpoint: "",
  rsvpWhatsApp: "",
  rsvpEmail: "",
};

const I18N = {
  en: {
    "hero.kicker": "We're getting married",
    "hero.rsvp": "RSVP",
    "countdown.title": "Countdown",
    "countdown.until": "Until",
    "countdown.days": "Days",
    "countdown.hours": "Hours",
    "countdown.minutes": "Minutes",
    "welcome.title": "Welcome!",
    "venue.title": "The Venue",
    "venue.subtitle": "Where we celebrate",
    "venue.openMaps": "Open in Maps",
    "programme.title": "Day Programme",
    "programme.arrival": "Arrival",
    "programme.ceremony": "Katb El Ketab",
    "programme.firstDance": "First Dance",
    "programme.cocktails": "Cocktail Hour",
    "programme.dinner": "Dinner",
    "programme.cake": "Cutting the cake",
    "programme.finish": "Finish",
    "dress.title": "Dress Code",
    "dress.women": "Women",
    "dress.womenText": "Wear whatever makes you feel beautiful",
    "dress.men": "Men",
    "dress.menText": "Dark suit with Tie / Papion",
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
  },
};

const t = (key, vars = {}) =>
  (I18N.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const weddingDate = new Date(CONFIG.date);

/* ---------- Static content ---------- */
function formatDate() {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" })
    .format(weddingDate);
}

// "16:00" -> "4:00 PM"
function to12h(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function renderConfig() {
  const values = { ...CONFIG, time: to12h(CONFIG.time), dateLong: formatDate() };
  $$("[data-cfg]").forEach((el) => (el.textContent = values[el.dataset.cfg]));
}

function renderTimeline() {
  $("#timeline").innerHTML = CONFIG.programme
    .map((p) => `<li><div class="time">${to12h(p.time)}</div><div class="what">${t("programme." + p.key)}</div></li>`)
    .join("");
}

function setupMap() {
  const q = encodeURIComponent(CONFIG.mapQuery);
  $("#map-frame").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("#map-link").href = CONFIG.mapLink || `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function renderText() {
  $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $$("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  renderConfig();
  renderTimeline();
  renderGuests();
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
  const targets = $$("section > *:not(.dress-bg), .dress-bg .card");
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
    if (window.scrollY < 10) $(".countdown").scrollIntoView({ behavior: "smooth" });
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

  const setPlaying = (on) => toggle.classList.toggle("playing", on);
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
    toggle.hidden = false;
    autoScrollIfIdle();
  };

  intro.addEventListener("click", () => {
    if (state !== "idle") return;
    state = "playing";
    music.play().catch(() => {});
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
renderText();
tick();
setInterval(tick, 30000);
setupReveal();
setupIntro();

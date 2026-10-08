/* =========================================================
   Edit the wedding details here.
   ========================================================= */
const CONFIG = {
  name1: "Yusuf",
  name2: "Rawan",
  // Date & time of the ceremony, Cairo time (UTC+2)
  date: "2026-11-20T15:00:00+02:00",
  time: "15:00",
  venueName: "Beau Jardin",
  address1: "Ismailia Desert Road, El Shorouk",
  address2: "Cairo, Egypt",
  mapQuery: "5JPJ+G43 Beau Jardin East, Ismailia Desert Rd, El Shorouk, Cairo Governorate",
  mapLink: "https://maps.app.goo.gl/r3tn38XmANG3feQ18",
  programme: [
    { time: "15:00", key: "arrival" },
    { time: "17:00", key: "ceremony" },
    { time: "18:30", key: "cocktails" },
    { time: "20:30", key: "dinner" },
    { time: "22:00", key: "cake" },
    { time: "00:00", key: "finish" },
  ],
  maxGuests: 6,
  // RSVP delivery. The first one that is set is used:
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
    "welcome.text": "We warmly invite you to celebrate our wedding day with us. We look forward to sharing this unforgettable moment with our most special people.",
    "venue.title": "The Venue",
    "venue.subtitle": "Where we celebrate",
    "venue.openMaps": "Open in Maps",
    "programme.title": "Day Programme",
    "programme.arrival": "Arrival",
    "programme.ceremony": "Katb El Ketab",
    "programme.cocktails": "Cocktails",
    "programme.dinner": "Dinner",
    "programme.cake": "Cutting the cake",
    "programme.finish": "Finish",
    "dress.title": "Dress Code",
    "dress.women": "Women",
    "dress.womenText": "Cocktail or formal dress",
    "dress.men": "Men",
    "dress.menText": "Dark suit and tie",
    "rsvp.subtitle": "Kindly let us know if you can join us",
    "rsvp.attending": "Will you be attending?",
    "rsvp.yes": "Yes, I'll be there",
    "rsvp.no": "Unfortunately, I can't make it",
    "rsvp.howMany": "How many guests?",
    "rsvp.person": "Person {n}",
    "rsvp.mainContact": "(Main contact)",
    "rsvp.fullName": "Full name",
    "rsvp.email": "Email address",
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

function renderConfig() {
  const values = { ...CONFIG, dateLong: formatDate() };
  $$("[data-cfg]").forEach((el) => (el.textContent = values[el.dataset.cfg]));
}

function renderTimeline() {
  $("#timeline").innerHTML = CONFIG.programme
    .map((p) => `<li><div class="time">${p.time}</div><div class="what">${t("programme." + p.key)}</div></li>`)
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
      email: $("[name=email]", g)?.value ?? "",
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
      ${i === 0 ? `<input class="field" type="email" name="email" placeholder="${t("rsvp.email")}" value="${esc(d.email)}" autocomplete="email">` : ""}
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
      lines.push(`  ${i + 1}. ${g.name}${g.email ? ` <${g.email}>` : ""}${g.dietary ? ` – ${g.dietary}` : ""}`);
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
      name: g.name.trim(), email: g.email.trim(), dietary: g.dietary.trim(),
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
    if (CONFIG.rsvpEndpoint) {
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

/* ---------- Init ---------- */
setupMap();
setupRsvp();
renderText();
tick();
setInterval(tick, 30000);
setupReveal();

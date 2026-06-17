const invite = {
  groom: "عمر",
  bride: "سلمى",
  weekday: "الخميس",
  dateText: "12 ديسمبر 2026",
  timeText: "الساعة 8 مساء",
  intro: "يشرفنا حضوركم ومشاركتكم أجمل ليلة في العمر.",
  venueName: "قاعة اللؤلؤة",
  venueAddress: "كورنيش النيل، القاهرة",
  mapUrl: "https://maps.google.com/?q=Cairo%20Nile%20Corniche",
  eventDate: "2026-12-12T20:00:00+02:00",
};

const root = document.querySelector(".invitation");
const openButton = document.querySelector("#openInvite");
const soundButton = document.querySelector("#soundToggle");
const shareButton = document.querySelector("#shareInvite");
const rsvpButton = document.querySelector("#rsvpButton");
const details = document.querySelector("#details");
const fallingLayer = document.querySelector("#fallingLayer");
const toast = document.querySelector("#toast");
const statusText = document.querySelector("#statusText");

let tone;
let toastTimer;

function setText(id, text) {
  const element = document.querySelector(id);
  if (element) element.textContent = text;
}

function hydrateInvite() {
  const names = `${invite.groom} & ${invite.bride}`;
  document.title = `دعوة فرح | ${names}`;
  setText("#coverNames", names);
  setText("#coupleNames", names);
  setText("#weekday", invite.weekday);
  setText("#dateText", invite.dateText);
  setText("#timeText", invite.timeText);
  setText("#introText", invite.intro);
  setText("#venueName", invite.venueName);
  setText("#venueAddress", invite.venueAddress);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function startTone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext || tone) return;

  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.value = 0.035;
  gain.connect(context.destination);

  const notes = [392, 493.88, 587.33, 493.88];
  let step = 0;

  const play = () => {
    const osc = context.createOscillator();
    osc.type = "sine";
    osc.frequency.value = notes[step % notes.length];
    osc.connect(gain);
    osc.start();
    osc.stop(context.currentTime + 0.18);
    step += 1;
  };

  play();
  tone = {
    context,
    interval: setInterval(play, 720),
  };
}

function stopTone() {
  if (!tone) return;
  clearInterval(tone.interval);
  tone.context.close();
  tone = null;
}

function updateCountdown() {
  const target = new Date(invite.eventDate).getTime();
  const diff = Math.max(0, target - Date.now());
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  const values = {
    days: Math.floor(diff / day),
    hours: Math.floor((diff % day) / hour),
    minutes: Math.floor((diff % hour) / minute),
    seconds: Math.floor((diff % minute) / 1000),
  };

  Object.entries(values).forEach(([id, value]) => {
    setText(`#${id}`, String(value).padStart(2, "0"));
  });
}

openButton.addEventListener("click", () => {
  root.classList.add("is-open");
  document.querySelector(".letter-head")?.classList.add("is-visible");
  details.scrollTo({ top: 0, behavior: "smooth" });
  showToast("اتفتح الجواب");
});

soundButton.addEventListener("click", () => {
  if (tone) {
    stopTone();
    soundButton.classList.remove("sound-on");
    showToast("اتقفلت الموسيقى");
  } else {
    startTone();
    soundButton.classList.add("sound-on");
    showToast("اشتغلت الموسيقى");
  }
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: `دعوة فرح ${invite.groom} و${invite.bride}`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("اتنسخ لينك الدعوة");
    }
  } catch {
    showToast("المشاركة اتلغت");
  }
});

if (rsvpButton) {
  rsvpButton.addEventListener("click", () => {
    statusText.textContent = "اتسجل تأكيد حضورك، مستنيينك تنورنا.";
    localStorage.setItem("wedding-rsvp", "yes");
  });
}

hydrateInvite();
updateCountdown();
setInterval(updateCountdown, 1000);

function buildFallingPieces() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#fff3df", "#f1c9c8", "#f7e6bc", "#d7e1d1"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 14; index += 1) {
    const piece = document.createElement("span");
    piece.className = "falling-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--size", `${5 + Math.random() * 8}px`);
    piece.style.setProperty("--drift", `${-46 + Math.random() * 92}px`);
    piece.style.setProperty("--duration", `${13 + Math.random() * 10}s`);
    piece.style.setProperty("--delay", `${Math.random() * -16}s`);
    piece.style.setProperty("--piece-color", colors[index % colors.length]);
    fragment.appendChild(piece);
  }

  fallingLayer.appendChild(fragment);
}

function watchRevealItems() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      root: details,
      threshold: 0.26,
    },
  );

  items.forEach((item) => observer.observe(item));
}

buildFallingPieces();
watchRevealItems();

if (localStorage.getItem("wedding-rsvp") === "yes") {
  statusText.textContent = "حضورك متأكد، مستنيينك تنورنا.";
}

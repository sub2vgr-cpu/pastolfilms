/* =========================================================
   PASTOL FILMS — site behavior
   Kinukuha ng file na ito ang laman mula sa content/*.json —
   mga file na ina-edit ng admin sa pamamagitan ng /admin panel.
   HINDI na dapat i-edit ang file na ito para lang magbago ang
   laman ng site (logo, proyekto, anunsyo, kulay) — gamitin ang /admin.
   ========================================================= */

const PLAY_ICON = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;

async function loadJSON(path){
  try{
    const res = await fetch(path, { cache: "no-store" });
    if(!res.ok) throw new Error(`Hindi ma-load ang ${path}`);
    return await res.json();
  }catch(err){
    console.warn(err);
    return null;
  }
}

function formatDate(iso){
  const months = ["Ene","Peb","Mar","Abr","May","Hun","Hul","Ago","Set","Okt","Nob","Dis"];
  const d = new Date(iso + "T00:00:00");
  return { day: d.getDate(), month: months[d.getMonth()], year: d.getFullYear() };
}

/* ---------- Settings (logo, hero text, contact, colors) ---------- */
function applySettings(settings){
  if(!settings) return;

  if(settings.logo){
    document.getElementById("brandLogo").src = settings.logo;
  }
  if(settings.site_title){
    const [first, ...rest] = settings.site_title.split(" ");
    const restText = rest.join(" ");
    const emHTML = restText ? ` <em>${restText}</em>` : "";
    document.getElementById("brandText").innerHTML = `${first}${emHTML}`;
    document.getElementById("footerBrand").innerHTML = `${first}${emHTML}`;
    document.title = `${settings.site_title} — ${settings.tagline || ""}`.trim();
    document.getElementById("footerName").textContent = settings.site_title;
  }
  if(settings.tagline){
    document.getElementById("heroEyebrow").textContent = settings.tagline;
  }
  if(settings.hero_heading){
    document.getElementById("heroHeading").textContent = settings.hero_heading;
  }
  if(settings.hero_subtext){
    document.getElementById("heroSubtext").textContent = settings.hero_subtext;
  }
  if(settings.email){
    const emailLink = document.getElementById("emailLink");
    emailLink.href = `mailto:${settings.email}`;
    emailLink.textContent = settings.email;
  }
  const socialMap = { facebook: "fbLink", instagram: "igLink", youtube: "ytLink" };
  Object.entries(socialMap).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if(settings[key]){
      el.href = settings[key];
      el.closest("li").style.display = "";
    } else {
      el.closest("li").style.display = "none";
    }
  });

  const root = document.documentElement.style;
  if(settings.accent_color) root.setProperty("--gold", settings.accent_color);
  if(settings.navy_color) root.setProperty("--navy", settings.navy_color);
}

/* ---------- Projects / Videos ---------- */
let ALL_PROJECTS = [];

function renderProjects(list){
  const grid = document.getElementById("projectGrid");
  if(!list || !list.length){
    grid.innerHTML = `<p class="empty-note">Wala pang proyektong nakalista. Idagdag ito sa /admin.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <article class="project-card">
      <a class="project-thumb" href="${p.url || '#'}" target="_blank" rel="noopener" aria-label="Panoorin ang ${p.title}"
         ${p.thumbnail ? `style="background-image:url('${p.thumbnail}');background-size:cover;background-position:center;"` : ""}>
        <span class="play-btn">${PLAY_ICON}</span>
      </a>
      <div class="project-body">
        <span class="project-tag">${p.category || ""}</span>
        <h3>${p.title}</h3>
        <p>${p.desc || ""}</p>
        <a class="project-watch" href="${p.url || '#'}" target="_blank" rel="noopener">Panoorin &rarr;</a>
      </div>
    </article>
  `).join("");
}

function renderFilters(projects){
  const cats = ["Lahat", ...new Set(projects.map(p => p.category).filter(Boolean))];
  const wrap = document.getElementById("projectFilters");
  wrap.innerHTML = cats.map((c, i) => `
    <button class="filter-chip ${i === 0 ? "is-active" : ""}" data-filter="${c}">${c}</button>
  `).join("");

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    wrap.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const filter = btn.dataset.filter;
    renderProjects(filter === "Lahat" ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.category === filter));
  });
}

/* ---------- Announcements ---------- */
function renderAnnouncements(announcements){
  const feed = document.getElementById("announceFeed");
  if(!announcements || !announcements.length){
    feed.innerHTML = `<p class="empty-note">Wala pang anunsyo. Idagdag ito sa /admin.</p>`;
    return;
  }
  const sorted = [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
  feed.innerHTML = sorted.map(a => {
    const d = formatDate(a.date);
    return `
      <div class="announce-item">
        <div class="announce-date"><span class="day">${d.day}</span>${d.month} ${d.year}</div>
        <div class="announce-body">
          <span class="announce-badge">${a.badge || ""}</span>
          <h3>${a.title}</h3>
          <p>${a.body}</p>
        </div>
      </div>
    `;
  }).join("");
}

/* ---------- Nav + Contact form (di na kailangan i-edit) ---------- */
function initNav(){
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function initContactForm(defaultEmail){
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const to = document.getElementById("emailLink").textContent.trim() || defaultEmail;
    const subject = encodeURIComponent(`[Inquiry] ${data.get("type")} — ${data.get("name")}`);
    const body = encodeURIComponent(
      `Pangalan: ${data.get("name")}\nEmail: ${data.get("email")}\nUri: ${data.get("type")}\n\nMensahe:\n${data.get("message")}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    note.textContent = "Binubuksan ang iyong email app para ipadala ang mensahe...";
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  initNav();
  document.getElementById("year").textContent = new Date().getFullYear();

  const [settingsData, projectsData, announceData] = await Promise.all([
    loadJSON("content/settings.json"),
    loadJSON("content/projects.json"),
    loadJSON("content/announcements.json"),
  ]);

  applySettings(settingsData);
  initContactForm(settingsData?.email || "hello@pastolfilms.com");

  ALL_PROJECTS = projectsData?.projects || [];
  renderFilters(ALL_PROJECTS);
  renderProjects(ALL_PROJECTS);

  renderAnnouncements(announceData?.announcements || []);
});
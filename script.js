const TEAMS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUAmM6RN1RGM0conwd_6-3nRI6vHk70bpw7sfykf9GoKq_4xDDq1j_fsKrHdkbYbVnTful0z7koip/pub?gid=589028711&single=true&output=csv";
const SOCIAL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUAmM6RN1RGM0conwd_6-3nRI6vHk70bpw7sfykf9GoKq_4xDDq1j_fsKrHdkbYbVnTful0z7koip/pub?gid=1519782147&single=true&output=csv";

function parseCSV(text) {
  const [header, ...rows] = text.trim().split(/\r?\n/).map(r => r.split(","));
  return rows.map(r => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ? r[i].trim() : ""])));
}

async function fetchCSV(url) {
  const res = await fetch(url);
  return parseCSV(await res.text());
}

function getCurrentSeason() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (month >= 8 && month <= 11) return "Fall";
  if (month === 12 || month <= 3 || (month === 3 && day <= 15)) return "Winter";
  return "Spring";
}

function renderChips(season) {
  const seasonChips = ["Fall", "Winter", "Spring"];
  const genderChips = ["Boys", "Girls"];
  const seasonEl = document.getElementById("seasonChips");
  const genderEl = document.getElementById("genderChips");
  seasonEl.innerHTML = seasonChips.map(s => `<div class="chip ${s===season?'active':''}" data-type="season" data-value="${s}">${s}</div>`).join("");
  genderEl.innerHTML = genderChips.map(g => `<div class="chip" data-type="gender" data-value="${g}">${g}</div>`).join("");

  document.querySelectorAll(".chip").forEach(chip => chip.addEventListener("click", () => {
    if (chip.dataset.type === "season") {
      document.querySelectorAll("#seasonChips .chip").forEach(c => c.classList.remove("active"));
    } else {
      document.querySelectorAll("#genderChips .chip").forEach(c => c.classList.remove("active"));
    }
    chip.classList.add("active");
    renderTeams();
  }));
}

let teamsData = [];
async function renderTeams() {
  const season = document.querySelector("#seasonChips .chip.active")?.dataset.value;
  const gender = document.querySelector("#genderChips .chip.active")?.dataset.value;
  const container = document.getElementById("teamsContainer");
  container.innerHTML = "";
  teamsData.forEach(team => {
    if (season && team.Season && team.Season !== season && team.Season !== "All") return;
    if (gender && team.Gender && team.Gender !== gender) return;
    container.innerHTML += `<div class="team-card">
      <h3>${team.Team}</h3>
      <div class="buttons">
        <a href="${team.MessageLink||'#'}" target="_blank"><button class="message-btn">💬 Message</button></a>
        <a href="${team.iCal||'#'}" target="_blank"><button class="subscribe-btn">📅 Subscribe</button></a>
      </div>
    </div>`;
  });
}

async function renderSocial() {
  const data = await fetchCSV(SOCIAL_CSV);
  const si = document.getElementById("social-icons");
  const wt = document.getElementById("websites-text");
  si.innerHTML = ""; wt.innerHTML = "";
  data.forEach(r => {
    if (!r.Platform || !r.URL) return;
    const icon = r.Icon ? r.Icon.trim() : "";
    if (icon) {
      si.innerHTML += `<a href="${r.URL}" target="_blank"><img src="icons/${icon}" alt="${r.Platform}" onerror="this.onerror=null;this.src='icons/link.png';"></a>`;
    } else {
      wt.innerHTML += `<a href="${r.URL}" target="_blank">${r.Platform}</a>`;
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const season = getCurrentSeason();
  renderChips(season);
  teamsData = await fetchCSV(TEAMS_CSV);
  renderTeams();
  renderSocial();
});

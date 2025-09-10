const TEAMS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUAmM6RN1RGM0conwd_6-3nRI6vHk70bpw7sfykf9GoKq_4xDDq1j_fsKrHdkbYbVnTful0z7koip/pub?gid=589028711&single=true&output=csv";
const SOCIALS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUAmM6RN1RGM0conwd_6-3nRI6vHk70bpw7sfykf9GoKq_4xDDq1j_fsKrHdkbYbVnTful0z7koip/pub?gid=1519782147&single=true&output=csv";

document.getElementById("logo").addEventListener("click", () => location.reload());

async function fetchCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  return text.split("\n").map(r => r.split(","));
}

function buildTeams(data) {
  const container = document.getElementById("team-container");
  const headers = data[0];
  data.slice(1).forEach(row => {
    const team = {};
    headers.forEach((h, i) => team[h.trim()] = row[i] || "");
    if (!team.Sport) return;

    const chip = document.createElement("div");
    chip.className = "team-chip";

    const nameDiv = document.createElement("div");
    nameDiv.className = "team-name";
    nameDiv.textContent = `${team.Gender ? team.Gender + " " : ""}${team.Sport} ${team.Level || ""}`.trim();
    chip.appendChild(nameDiv);

    if (team.Gender && team.Gender !== "Coed") {
      const left = document.createElement("div");
      left.className = "corner-label corner-left";
      left.textContent = team.Gender;
      chip.appendChild(left);
    }
    if (team.Level) {
      const right = document.createElement("div");
      right.className = "corner-label corner-right";
      right.textContent = team.Level;
      chip.appendChild(right);
    }

    const iconsDiv = document.createElement("div");
    iconsDiv.className = "icon-buttons";
    if (team["Team Messaging URL"]) {
      const msg = document.createElement("a");
      msg.href = team["Team Messaging URL"];
      msg.target = "_blank";
      const img = document.createElement("img");
      img.src = "icons/message.png";
      img.alt = "Message";
      msg.appendChild(img);
      iconsDiv.appendChild(msg);
    }
    if (team["ics-URL"]) {
      const sub = document.createElement("a");
      sub.href = team["ics-URL"];
      sub.target = "_blank";
      const img = document.createElement("img");
      img.src = "icons/calendar.png";
      img.alt = "Subscribe";
      sub.appendChild(img);
      iconsDiv.appendChild(sub);
    }
    chip.appendChild(iconsDiv);

    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.textContent = team.Coach || team.Contact ? `Coach: ${team.Coach || "N/A"} | Contact: ${team.Contact || "N/A"}` : "Info coming soon…";

    chip.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") return; // prevent double toggle
      accordion.classList.toggle("open");
    });

    container.appendChild(chip);
    container.appendChild(accordion);
  });
}

function buildSocials(data) {
  const container = document.getElementById("social-icons");
  const headers = data[0];
  data.slice(1).forEach(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i] || "");
    if (!obj.URL || !obj.Icon) return;

    const link = document.createElement("a");
    link.href = obj.URL;
    link.target = "_blank";

    const img = document.createElement("img");
    img.src = "icons/" + obj.Icon;
    img.alt = obj.Platform;
    img.onerror = () => img.src = "icons/red-x.png";

    link.appendChild(img);
    container.appendChild(link);
  });
}

async function init() {
  const teams = await fetchCSV(TEAMS_CSV);
  buildTeams(teams);

  const socials = await fetchCSV(SOCIALS_CSV);
  buildSocials(socials);
}

init(); 

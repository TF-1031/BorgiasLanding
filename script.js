const TEAMS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUAmM6RN1RGM0conwd_6-3nRI6vHk70bpw7sfykf9GoKq_4xDDq1j_fsKrHdkbYbVnTful0z7koip/pub?gid=589028711&single=true&output=csv";
const SOCIALS_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRyUAmM6RN1RGM0conwd_6-3nRI6vHk70bpw7sfykf9GoKq_4xDDq1j_fsKrHdkbYbVnTful0z7koip/pub?gid=1519782147&single=true&output=csv";

const BAD_VALUES = new Set(["", "n/a", "na", "tbd", "coming soon", "-"]);
const LOCAL_FILE_EXTENSIONS = new Set([
  "html",
  "htm",
  "php",
  "asp",
  "aspx",
  "ics",
  "csv",
  "tsv",
  "json",
  "xml",
  "txt",
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "bmp",
  "ico",
  "js",
  "mjs",
  "cjs",
  "css",
  "map",
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  "mp4",
  "mp3",
  "mov",
  "webm",
  "zip",
  "gz",
  "tar",
  "tgz",
  "rar"
]);

const logo = document.getElementById("logo");
if (logo) {
  logo.addEventListener("click", () => location.reload());
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "\"") {
      if (inQuotes && text[i + 1] === "\"") {
        cell += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "\n") {
      if (inQuotes) {
        cell += "\n";
      } else {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      }
    } else if (char === "\r") {
      if (inQuotes) cell += char;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows
    .map(r => r.map(v => v.trim()))
    .filter(r => r.some(v => v.trim().length));
}

async function fetchCSV(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status}`);
  }
  const text = await res.text();
  return parseCSV(text);
}

function normalizeValue(value) {
  const trimmed = (value || "").trim();
  return BAD_VALUES.has(trimmed.toLowerCase()) ? "" : trimmed;
}

function normalizeLink(value) {
  const raw = normalizeValue(value);
  if (!raw) return "";
  if (
    /^[a-z][a-z0-9+.-]*:/i.test(raw) ||
    raw.startsWith("//") ||
    raw.startsWith("#") ||
    raw.startsWith("/") ||
    raw.startsWith("./") ||
    raw.startsWith("../")
  ) {
    return raw;
  }

  const firstSegment = raw.split("/")[0];
  const [segmentWithoutQuery] = firstSegment.split(/[?#]/);
  if (!segmentWithoutQuery || segmentWithoutQuery.startsWith(".")) {
    return raw;
  }

  const colonIndex = segmentWithoutQuery.indexOf(":");
  const hostCandidate = colonIndex >= 0
    ? segmentWithoutQuery.slice(0, colonIndex)
    : segmentWithoutQuery;

  const hostParts = hostCandidate.split(".");
  if (hostParts.length >= 2) {
    const tld = hostParts[hostParts.length - 1].toLowerCase();
    if (!LOCAL_FILE_EXTENSIONS.has(tld) && /^[a-z]{2,63}$/.test(tld)) {
      return `https://${raw}`;
    }
  }

  return raw;
}

function resolveIconSource(value) {
  const raw = normalizeValue(value);
  if (!raw) return "";
  if (/^(?:https?:|data:|blob:)/i.test(raw) || raw.startsWith("//")) {
    return raw;
  }

  const sanitized = raw.replace(/\\/g, "/").trim();
  if (!sanitized) return "";
  if (sanitized.startsWith("/") || sanitized.startsWith("../")) {
    return sanitized;
  }

  let trimmed = sanitized;
  while (trimmed.startsWith("./")) {
    trimmed = trimmed.slice(2);
  }
  if (!trimmed) return "";

  if (trimmed.toLowerCase().startsWith("icons/")) {
    const remainder = trimmed.slice(6);
    return remainder ? `icons/${remainder}` : "";
  }

  if (trimmed.includes("/")) {
    return trimmed;
  }

  return `icons/${trimmed}`;
}

function buildTeams(data) {
  const container = document.getElementById("team-container");
  if (!container || !data.length) return;
  container.innerHTML = "";
  const headers = data[0];
  data.slice(1).forEach(row => {
    const team = {};
    headers.forEach((h, i) => team[h.trim()] = normalizeValue(row[i]));
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
    const messageUrl = normalizeLink(team["Team Messaging URL"]);
    if (messageUrl) {
      const msg = document.createElement("a");
      msg.href = messageUrl;
      msg.target = "_blank";
      msg.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = "icons/message.png";
      img.alt = "Message";
      img.loading = "lazy";
      msg.appendChild(img);
      iconsDiv.appendChild(msg);
    }
    const calendarUrl = normalizeLink(team["ics-URL"]);
    if (calendarUrl) {
      const sub = document.createElement("a");
      sub.href = calendarUrl;
      sub.target = "_blank";
      sub.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = "icons/calendar.png";
      img.alt = "Subscribe";
      img.loading = "lazy";
      sub.appendChild(img);
      iconsDiv.appendChild(sub);
    }
    if (iconsDiv.children.length) {
      chip.appendChild(iconsDiv);
    }

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
  const iconContainer = document.getElementById("social-icons");
  const textContainer = document.getElementById("websites-text");
  if (!iconContainer && !textContainer) return;
  if (!data.length) return;
  if (iconContainer) iconContainer.innerHTML = "";
  if (textContainer) textContainer.innerHTML = "";
  const headers = data[0];
  data.slice(1).forEach(row => {
    if (!row || !row.length) return;
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = normalizeValue(row[i]));

    const url = normalizeLink(obj.URL || obj.Link || obj.Href);
    if (!url) return;

    const iconPath = resolveIconSource(obj.Image || obj.Icon || obj.Img || obj["Image URL"]);
    const label = obj.Label || obj.Platform || obj.Name || obj.Title || obj.Description || url.replace(/^https?:\/\//i, "");

    if (iconPath && iconContainer) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const img = document.createElement("img");
      img.src = iconPath;
      img.alt = label || "External link";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.onerror = () => {
        img.onerror = null;
        img.src = "icons/red-x.png";
      };

      link.appendChild(img);
      iconContainer.appendChild(link);
    } else if (textContainer) {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = label || url;
      textContainer.appendChild(anchor);
    }
  });
}

async function init() {
  try {
    const teams = await fetchCSV(TEAMS_CSV);
    buildTeams(teams);
  } catch (err) {
    console.error("Unable to load teams", err);
  }

  try {
    const socials = await fetchCSV(SOCIALS_CSV);
    buildSocials(socials);
  } catch (err) {
    console.error("Unable to load social links", err);
  }
}

init(); 

// ========== DOM REFERENCES ==========
const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const themeToggle = document.getElementById("themeToggle");
const form = document.getElementById("input-form");
const semesterInput = document.getElementById("semester");
const subjectCountInput = document.getElementById("subjectCount");
const cgpaInput = document.getElementById("cgpa");
const percentageDisplay = document.getElementById("percentageDisplay");
const dynamicSubjects = document.getElementById("dynamicSubjects");
const semesterList = document.getElementById("semesterList");
const scoreDisplay = document.getElementById("scoreDisplay");
const cgpaChart = document.getElementById("cgpaChart");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const printBtn = document.getElementById("printBtn");
const exportBtn = document.getElementById("exportBtn");
const resetBtn = document.getElementById("resetBtn");
const collapseBtn = document.getElementById("collapseBtn");
const storedSemestersCount = document.getElementById("storedSemestersCount");

// ========== DATA STORAGE ==========
let semesters = {};

// ========== TOGGLE SIDEBAR ==========
toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("hide");
  document.body.classList.toggle("hide-sidebar");
});

// ========== DARK MODE ==========
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", themeToggle.checked);
});

// ========== LIVE PERCENTAGE DISPLAY ==========
cgpaInput.addEventListener("input", () => {
  const val = parseFloat(cgpaInput.value);
  if (!isNaN(val)) {
    let percent = ((val - 0.75) * 10).toFixed(2);
    percentageDisplay.textContent = `≈ ${percent}%`;
  } else {
    percentageDisplay.textContent = "";
  }
});

// ========== DYNAMIC SUBJECT INPUTS ==========
subjectCountInput.addEventListener("change", () => {
  dynamicSubjects.innerHTML = "";
  const count = parseInt(subjectCountInput.value);
  for (let i = 1; i <= count; i++) {
    const line = document.createElement("div");
    line.classList.add("input-line");
    line.innerHTML = `
      <input class="subject-name interactive" placeholder="Subject ${i}" required />
      <input class="subject-score interactive" type="number" placeholder="Marks" required />
      <input class="subject-grade interactive" placeholder="Grade" required />
    `;
    dynamicSubjects.appendChild(line);
  }
});

// ========== ADD/EDIT SEMESTER ==========
form.addEventListener("submit", e => {
  e.preventDefault();
  const sem = semesterInput.value.trim();
  const sgpa = cgpaInput.value.trim();
  const names = [...document.querySelectorAll(".subject-name")].map(input => input.value.trim());
  const scores = [...document.querySelectorAll(".subject-score")].map(input => +input.value);
  const grades = [...document.querySelectorAll(".subject-grade")].map(input => input.value.trim());

  if (!sem || !sgpa || names.includes("") || grades.includes("") || scores.some(isNaN)) {
    alert("Please fill in all fields.");
    return;
  }

  semesters[sem] = { names, scores, grades, sgpa };
  saveAndRender();
  form.reset();
  dynamicSubjects.innerHTML = "";
  percentageDisplay.textContent = "";
});

// ========== RENDER SEMESTER BUTTONS ==========
function renderSidebar() {
  semesterList.innerHTML = "";
  Object.keys(semesters).forEach(sem => {
    const btn = document.createElement("button");
    btn.className = "semester-btn";
    btn.textContent = sem;
    btn.onclick = () => displaySemester(sem);
    semesterList.appendChild(btn);
  });

  storedSemestersCount.textContent = `📚 Stored Semesters: ${Object.keys(semesters).length}`;
}

// ========== DISPLAY SEMESTER ==========
function displaySemester(sem) {
  const data = semesters[sem];
  let rows = "";
  const maxScore = Math.max(...data.scores);

  data.names.forEach((name, i) => {
    const badge = data.scores[i] === maxScore ? '🏅' : '';
    rows += `
      <tr>
        <td>${name}</td>
        <td>${data.scores[i]} ${badge}</td>
        <td>${data.grades[i]}</td>
      </tr>`;
  });

  scoreDisplay.innerHTML = `
    <div class="scorecard">
      <h2>${sem}</h2>
      <table class="result-table">
        <thead>
          <tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>SGPA:</strong> <span style="color:${googleColor(sem)}">${data.sgpa}</span></p>
    </div>
  `;
}

// ========== COLOR UTILS ==========
function barColor(i) {
  const colors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"];
  return colors[i % colors.length];
}
function googleColor(key) {
  const sum = Array.from(key).reduce((a, c) => a + c.charCodeAt(0), 0);
  return barColor(sum);
}

// ========== LOAD FROM STORAGE ==========
loadBtn.addEventListener("click", () => {
  const saved = localStorage.getItem("scoreData");
  if (saved) {
    semesters = JSON.parse(saved);
    saveAndRender();
    alert("Data loaded.");
  }
});

// ========== SAVE & RENDER ==========
function saveAndRender() {
  localStorage.setItem("scoreData", JSON.stringify(semesters));
  renderSidebar();
  renderChart();
}

// ========== CLEAR LAST ==========
clearBtn.addEventListener("click", () => {
  const keys = Object.keys(semesters);
  if (!keys.length) return;
  delete semesters[keys[keys.length - 1]];
  saveAndRender();
  scoreDisplay.innerHTML = "";
});

// ========== RESET ALL ==========
resetBtn.addEventListener("click", () => {
  if (confirm("This will remove all saved semesters. Are you sure?")) {
    semesters = {};
    localStorage.removeItem("scoreData");
    saveAndRender();
    scoreDisplay.innerHTML = "";
  }
});

// ========== COLLAPSE ALL RESULTS ==========
collapseBtn.addEventListener("click", () => {
  scoreDisplay.innerHTML = "";
});

// ========== PRINT CURRENT ==========
printBtn.addEventListener("click", () => window.print());

// ========== EXPORT ALL SEMESTERS ==========
exportBtn.addEventListener("click", () => {
  const container = document.createElement("div");
  Object.keys(semesters).forEach(sem => {
    const d = semesters[sem];
    let rows = "";
    d.names.forEach((n, i) => {
      rows += `<tr>
        <td>${n}</td>
        <td>${d.scores[i]}</td>
        <td>${d.grades[i]}</td>
      </tr>`;
    });
    container.innerHTML += `
      <div class="scorecard">
        <h2>${sem}</h2>
        <table class="result-table">
          <thead><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p><strong>SGPA:</strong> ${d.sgpa}</p>
      </div>`;
  });
  toImage(container).then(canvas => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "All_Semesters.png";
    link.click();
  });
});

// ========== CANVAS IMAGE EXPORT ==========
function toImage(el) {
  return new Promise(res => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='2000'>
      <foreignObject width='100%' height='100%'>
        ${new XMLSerializer().serializeToString(el)}
      </foreignObject>
    </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 2000;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      res(canvas);
    };
    img.src = url;
  });
}

// ========== CHART ==========
function renderChart() {
  const ctx = cgpaChart.getContext("2d");
  ctx.clearRect(0, 0, cgpaChart.width, cgpaChart.height);
  const keys = Object.keys(semesters);
  const vals = keys.map(k => parseFloat(semesters[k].sgpa));
  const max = 10;
  const bw = 30, gap = 20;
  const H = cgpaChart.height - 40;

  keys.forEach((sem, i) => {
    const h = (vals[i] / max) * H;
    const x = 40 + i * (bw + gap);
    const y = H - h + 20;
    ctx.fillStyle = barColor(i);
    ctx.fillRect(x, y, bw, h);
    ctx.fillStyle = "#202124";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sem, x + bw / 2, H + 35);
  });
}

// ========== INIT ==========
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("scoreData");
  if (saved) semesters = JSON.parse(saved);
  saveAndRender();
});

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const clearCompleted = document.querySelector("#clearCompleted");
const quickAdd = document.querySelector("#quickAdd");
const taskCount = document.querySelector("#taskCount");
const tasksLeft = document.querySelector("#tasksLeft");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const timerDisplay = document.querySelector("#timerDisplay");
const timerToggle = document.querySelector("#timerToggle");
const timerReset = document.querySelector("#timerReset");
const dailyNote = document.querySelector("#dailyNote");
const noteStatus = document.querySelector("#noteStatus");
const noteCount = document.querySelector("#noteCount");
const themeToggle = document.querySelector("#themeToggle");
let timerSeconds = 25 * 60;
let timerInterval;

function saveTasks() {
  const tasks = [...taskList.querySelectorAll(".task")].map((task) => ({
    title: task.querySelector("span").textContent,
    time: task.querySelector("time").textContent,
    done: task.classList.contains("done"),
  }));
  localStorage.setItem("focus-tasks", JSON.stringify(tasks));
}

function restoreTasks() {
  const savedTasks = localStorage.getItem("focus-tasks");
  if (!savedTasks) return;

  try {
    const tasks = JSON.parse(savedTasks);
    if (!Array.isArray(tasks)) return;
    taskList.replaceChildren();
    tasks.forEach(({ title, time, done }) => {
      if (typeof title !== "string" || typeof time !== "string") return;
      const task = document.createElement("li");
      task.className = `task${done ? " done" : ""}`;
      task.innerHTML = `<button class="check" aria-label="${done ? "Mark task incomplete" : "Mark task complete"}">${done ? "✓" : ""}</button><span></span><time></time>`;
      task.querySelector("span").textContent = title;
      task.querySelector("time").textContent = time;
      taskList.append(task);
    });
  } catch {
    localStorage.removeItem("focus-tasks");
  }
}

function updateTaskSummary() {
  const tasks = [...taskList.querySelectorAll(".task")];
  const remaining = tasks.filter((task) => !task.classList.contains("done")).length;
  const completed = tasks.length - remaining;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  taskCount.textContent = remaining;
  tasksLeft.textContent = remaining;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress}% of your day is complete`;
}

function bindTask(task) {
  const check = task.querySelector(".check");
  check.addEventListener("click", () => {
    const completed = task.classList.toggle("done");
    check.textContent = completed ? "✓" : "";
    check.setAttribute("aria-label", completed ? "Mark task incomplete" : "Mark task complete");
    saveTasks();
    updateTaskSummary();
  });
}

restoreTasks();
document.querySelectorAll(".task").forEach(bindTask);
updateTaskSummary();

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  const task = document.createElement("li");
  task.className = "task";
  task.innerHTML = '<button class="check" aria-label="Mark task complete"></button><span></span><time>Today</time>';
  task.querySelector("span").textContent = title;
  taskList.append(task);
  bindTask(task);
  taskInput.value = "";
  taskInput.focus();
  saveTasks();
  updateTaskSummary();
});

clearCompleted.addEventListener("click", () => {
  taskList.querySelectorAll(".task.done").forEach((task) => task.remove());
  saveTasks();
  updateTaskSummary();
});

quickAdd.addEventListener("click", () => {
  taskInput.focus();
  taskInput.scrollIntoView({ behavior: "smooth", block: "center" });
});

function renderTimer() {
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

timerToggle.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = undefined;
    timerToggle.textContent = "Resume";
    return;
  }

  timerToggle.textContent = "Pause";
  timerInterval = setInterval(() => {
    if (timerSeconds === 0) {
      clearInterval(timerInterval);
      timerInterval = undefined;
      timerToggle.textContent = "Start";
      return;
    }

    timerSeconds -= 1;
    renderTimer();
  }, 1000);
});

timerReset.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = undefined;
  timerSeconds = 25 * 60;
  timerToggle.textContent = "Start";
  renderTimer();
});

function updateNoteCount() {
  noteCount.textContent = `${dailyNote.value.length} / 500`;
}

dailyNote.value = localStorage.getItem("focus-note") || "";
updateNoteCount();
dailyNote.addEventListener("input", () => {
  localStorage.setItem("focus-note", dailyNote.value);
  noteStatus.textContent = "Saved just now";
  updateNoteCount();
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  themeToggle.innerHTML = `${dark ? "☀" : "☾"} <span>${dark ? "Light" : "Theme"}</span>`;
  themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

applyTheme(localStorage.getItem("focus-theme") || "light");
themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("focus-theme", theme);
  applyTheme(theme);
});

document.querySelectorAll(".nav-link[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

const plannerData = {
  mon: [
    { title: "Weekly planning", time: "08:30", tone: "purple" },
    { title: "Deep work session", time: "10:00", tone: "green" },
  ],
  tue: [
    { title: "Project brief review", time: "09:00", tone: "purple" },
  ],
  wed: [
    { title: "Creative workshop", time: "11:00", tone: "orange" },
  ],
  thu: [],
  fri: [
    { title: "Weekly reflection", time: "15:30", tone: "green" },
  ],
};

const dayLabels = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
};

const dayTabs = document.querySelectorAll(".day-tab");
const scheduleList = document.querySelector("#scheduleList");
const emptySchedule = document.querySelector("#emptySchedule");
const selectedDayTitle = document.querySelector("#selectedDayTitle");
const selectedDayMeta = document.querySelector("#selectedDayMeta");
const blockCount = document.querySelector("#blockCount");
const blockForm = document.querySelector("#blockForm");
const blockTitle = document.querySelector("#blockTitle");
const blockTime = document.querySelector("#blockTime");
let selectedDay = "mon";

function formatTime(value) {
  const [hours, minutes] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes));
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function updateBlockCount() {
  const total = Object.values(plannerData).reduce((count, blocks) => count + blocks.length, 0);
  blockCount.textContent = total;
}

function renderSchedule() {
  const blocks = plannerData[selectedDay];
  const label = dayLabels[selectedDay];
  selectedDayTitle.textContent = `${label}'s focus`;
  selectedDayMeta.textContent = `${blocks.length} ${blocks.length === 1 ? "block" : "blocks"} planned`;
  scheduleList.replaceChildren();
  emptySchedule.hidden = blocks.length > 0;

  const sortedBlocks = blocks
    .slice()
    .sort((first, second) => first.time.localeCompare(second.time));

  sortedBlocks.forEach((block) => {
      const item = document.createElement("li");
      item.className = "schedule-item";
      item.innerHTML = `
        <span class="schedule-dot ${block.tone}"></span>
        <time>${formatTime(block.time)}</time>
        <strong></strong>
        <button class="delete-block" type="button" aria-label="Remove ${block.title}">×</button>
      `;
      item.querySelector("strong").textContent = block.title;
      item.querySelector(".delete-block").addEventListener("click", () => {
        const blockIndex = plannerData[selectedDay].indexOf(block);
        if (blockIndex !== -1) plannerData[selectedDay].splice(blockIndex, 1);
        renderSchedule();
        updateBlockCount();
      });
      scheduleList.append(item);
    });
}

dayTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedDay = tab.dataset.day;
    dayTabs.forEach((currentTab) => {
      const active = currentTab === tab;
      currentTab.classList.toggle("active", active);
      currentTab.setAttribute("aria-selected", active);
    });
    renderSchedule();
  });
});

blockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = blockTitle.value.trim();
  if (!title || !blockTime.value) return;

  plannerData[selectedDay].push({
    title,
    time: blockTime.value,
    tone: ["purple", "green", "orange"][plannerData[selectedDay].length % 3],
  });
  blockForm.reset();
  blockTime.value = "09:00";
  renderSchedule();
  updateBlockCount();
  blockTitle.focus();
});

renderSchedule();
updateBlockCount();

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const clearCompleted = document.querySelector("#clearCompleted");
const quickAdd = document.querySelector("#quickAdd");
const taskCount = document.querySelector("#taskCount");
const tasksLeft = document.querySelector("#tasksLeft");
const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector("#progressText");
const dailyNote = document.querySelector("#dailyNote");
const noteStatus = document.querySelector("#noteStatus");
const noteCount = document.querySelector("#noteCount");

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
    updateTaskSummary();
  });
}

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
  updateTaskSummary();
});

clearCompleted.addEventListener("click", () => {
  taskList.querySelectorAll(".task.done").forEach((task) => task.remove());
  updateTaskSummary();
});

quickAdd.addEventListener("click", () => {
  taskInput.focus();
  taskInput.scrollIntoView({ behavior: "smooth", block: "center" });
});

const savedNote = localStorage.getItem("focus-daily-note");
if (savedNote) dailyNote.value = savedNote;

function updateNote() {
  localStorage.setItem("focus-daily-note", dailyNote.value);
  noteCount.textContent = `${dailyNote.value.length} / 500`;
  noteStatus.textContent = "Saved just now";
}

dailyNote.addEventListener("input", updateNote);
updateNote();

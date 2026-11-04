const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const clearCompleted = document.querySelector("#clearCompleted");
const quickAdd = document.querySelector("#quickAdd");

function bindTask(task) {
  const check = task.querySelector(".check");
  check.addEventListener("click", () => {
    const completed = task.classList.toggle("done");
    check.textContent = completed ? "✓" : "";
    check.setAttribute("aria-label", completed ? "Mark task incomplete" : "Mark task complete");
  });
}

document.querySelectorAll(".task").forEach(bindTask);

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
});

clearCompleted.addEventListener("click", () => {
  taskList.querySelectorAll(".task.done").forEach((task) => task.remove());
});

quickAdd.addEventListener("click", () => {
  taskInput.focus();
  taskInput.scrollIntoView({ behavior: "smooth", block: "center" });
});

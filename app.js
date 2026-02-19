const STORAGE_KEY = "agentic-workstreams-simple-mvp";

const defaultState = {
  workstreams: [
    {
      id: crypto.randomUUID(),
      name: "Landing Page Prototype",
      tasks: [
        task("Draft core user flow", "Outline happy path and guardrails.", "Done"),
        task("Build hero + CTA", "Create the first shippable page version.", "In Progress"),
        task("Add analytics events", "Track CTA click and page scroll depth.", "Todo"),
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Onboarding Experiment",
      tasks: [
        task("Write step copy", "Keep each step under 90 chars.", "Todo"),
        task("Build first-time modal", "Support dismiss + remind later paths.", "Todo"),
      ],
    },
  ],
};

function task(title, description = "", status = "Todo") {
  return { id: crypto.randomUUID(), title, description, status };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadState();
let draggedTaskId = null;
let draggedWorkstreamId = null;
let pendingTaskWorkstreamId = null;

const workstreamsEl = document.getElementById("workstreams");
const workstreamModal = document.getElementById("workstream-modal");
const taskModal = document.getElementById("task-modal");
const workstreamForm = document.getElementById("workstream-form");
const taskForm = document.getElementById("task-form");

document.getElementById("reset-demo").addEventListener("click", () => {
  state = structuredClone(defaultState);
  persistAndRender();
});

document.getElementById("open-workstream-modal").addEventListener("click", () => {
  workstreamForm.reset();
  workstreamModal.showModal();
});

document.getElementById("cancel-workstream").addEventListener("click", () => {
  workstreamModal.close();
});

document.getElementById("cancel-task").addEventListener("click", () => {
  taskModal.close();
});

workstreamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("workstream-name");
  const name = input.value.trim();
  if (!name) return;

  state.workstreams.unshift({
    id: crypto.randomUUID(),
    name,
    tasks: [task("First task", "", "Todo")],
  });

  workstreamModal.close();
  persistAndRender();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!pendingTaskWorkstreamId) return;

  const ws = state.workstreams.find((item) => item.id === pendingTaskWorkstreamId);
  if (!ws) return;

  const name = document.getElementById("task-name").value.trim();
  const description = document.getElementById("task-description").value.trim();
  if (!name) return;

  ws.tasks.push(task(name, description, "Todo"));
  pendingTaskWorkstreamId = null;
  taskModal.close();
  persistAndRender();
});

function persistAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

function render() {
  workstreamsEl.innerHTML = "";

  if (!state.workstreams.length) {
    const empty = document.createElement("p");
    empty.textContent = "No workstreams yet. Use Add workstream.";
    workstreamsEl.appendChild(empty);
    return;
  }

  state.workstreams.forEach((ws) => {
    const container = document.createElement("section");
    container.className = "workstream";

    const header = document.createElement("div");
    header.className = "workstream-head";

    const titleWrap = document.createElement("div");
    titleWrap.className = "ws-title-wrap";

    const titleText = document.createElement("h3");
    titleText.textContent = ws.name;
    titleText.className = "ws-title";

    const titleInput = document.createElement("input");
    titleInput.value = ws.name;
    titleInput.className = "ws-title-input";

    const editBtn = document.createElement("button");
    editBtn.className = "subtle-btn";
    editBtn.textContent = "Edit";
    editBtn.type = "button";

    const saveTitle = () => {
      const nextName = titleInput.value.trim();
      if (!nextName) {
        titleInput.value = ws.name;
      } else {
        ws.name = nextName;
        persistAndRender();
        return;
      }
      titleWrap.classList.remove("editing");
    };

    editBtn.addEventListener("click", () => {
      titleWrap.classList.add("editing");
      titleInput.focus();
      titleInput.select();
    });

    titleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") saveTitle();
      if (event.key === "Escape") {
        titleInput.value = ws.name;
        titleWrap.classList.remove("editing");
      }
    });

    titleInput.addEventListener("blur", saveTitle);

    titleWrap.append(titleText, titleInput, editBtn);
    header.appendChild(titleWrap);

    const addTaskBtn = document.createElement("button");
    addTaskBtn.type = "button";
    addTaskBtn.className = "subtle-btn";
    addTaskBtn.textContent = "+ Add task";
    addTaskBtn.addEventListener("click", () => {
      pendingTaskWorkstreamId = ws.id;
      taskForm.reset();
      taskModal.showModal();
      document.getElementById("task-name").focus();
    });

    header.appendChild(addTaskBtn);
    container.appendChild(header);

    const backlog = document.createElement("div");
    backlog.className = "backlog";

    backlog.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    backlog.addEventListener("drop", (event) => {
      event.preventDefault();
      if (!draggedTaskId || draggedWorkstreamId !== ws.id) return;

      const draggedIndex = ws.tasks.findIndex((t) => t.id === draggedTaskId);
      if (draggedIndex < 0) return;
      if (ws.tasks[draggedIndex].status === "In Progress") return;

      const targetCard = event.target.closest("[data-task-id]");
      if (!targetCard) {
        const [moved] = ws.tasks.splice(draggedIndex, 1);
        ws.tasks.push(moved);
        persistAndRender();
        return;
      }

      const targetId = targetCard.dataset.taskId;
      const targetIndex = ws.tasks.findIndex((t) => t.id === targetId);
      if (targetIndex < 0 || targetId === draggedTaskId) return;

      const [moved] = ws.tasks.splice(draggedIndex, 1);
      ws.tasks.splice(targetIndex, 0, moved);
      persistAndRender();
    });

    ws.tasks.forEach((t) => {
      backlog.appendChild(taskCard(ws, t));
    });

    container.appendChild(backlog);
    workstreamsEl.appendChild(container);
  });
}

function taskCard(workstream, item) {
  const tpl = document.getElementById("task-template");
  const card = tpl.content.firstElementChild.cloneNode(true);
  card.dataset.taskId = item.id;

  card.querySelector(".task-title").textContent = item.title;
  card.querySelector(".task-description").textContent = item.description || "No description";
  card.querySelector(".task-state").textContent = item.status;

  if (item.status === "In Progress") {
    card.classList.add("in-progress");
    card.draggable = false;
  }

  if (item.status === "Done") {
    card.classList.add("done");
  }

  card.addEventListener("dragstart", () => {
    if (item.status === "In Progress") return;
    draggedTaskId = item.id;
    draggedWorkstreamId = workstream.id;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    draggedTaskId = null;
    draggedWorkstreamId = null;
    card.classList.remove("dragging");
  });

  card.querySelector("[data-action='start']").addEventListener("click", () => {
    if (item.status === "Done") return;

    workstream.tasks.forEach((taskItem) => {
      if (taskItem.status === "In Progress") taskItem.status = "Todo";
    });

    item.status = "In Progress";
    persistAndRender();
  });

  card.querySelector("[data-action='done']").addEventListener("click", () => {
    item.status = "Done";
    persistAndRender();
  });

  return card;
}

render();

import { TREE, UNCLASSIFIED } from "./tree.js";

const STORAGE_KEY = "grub-tree:subject";

const els = {
  subject: document.getElementById("subject"),
  start: document.getElementById("start"),
  step: document.getElementById("step"),
  progress: document.getElementById("progress"),
  trail: document.getElementById("trail"),
  concept: document.getElementById("concept"),
  question: document.getElementById("question"),
  options: document.getElementById("options"),
  back: document.getElementById("back"),
  restart: document.getElementById("restart"),
  subjectChip: document.getElementById("subject-chip"),
  result: document.getElementById("result"),
  resultCategory: document.getElementById("result-category"),
  resultConcept: document.getElementById("result-concept"),
  resultSubject: document.getElementById("result-subject"),
  resultPath: document.getElementById("result-path"),
  unclassified: document.getElementById("unclassified"),
  copy: document.getElementById("copy"),
  again: document.getElementById("again"),
  unclassifiedBack: document.getElementById("unclassified-back"),
  intro: document.getElementById("intro"),
  desc: document.getElementById("tree-desc"),
};

const state = {
  subject: "",
  nodeId: TREE.meta.id,
  history: [],
};

function nodeAt(id) {
  return TREE.nodes[id];
}

function show(id) {
  if (id === UNCLASSIFIED || !nodeAt(id)) {
    showUnclassified();
    return;
  }
  const node = nodeAt(id);
  if (node.kind === "result") {
    showResult(node);
    return;
  }
  showQuestion(node);
}

function showQuestion(node) {
  els.step.hidden = false;
  els.result.hidden = true;
  els.unclassified.hidden = true;
  els.subjectChip.textContent = state.subject;
  els.concept.textContent = node.concept || "";
  els.concept.hidden = !node.concept;
  els.question.textContent = interpolate(node.text);
  els.options.replaceChildren();

  node.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = option.label;
    button.dataset.label = option.label;
    button.addEventListener("click", () => answer(node, option));
    els.options.append(button);
  });

  els.progress.value = state.history.length;
  els.progress.max = 8;
  renderTrail();
  els.options.querySelector(".option")?.focus();
}

function answer(node, option) {
  state.history.push({
    nodeId: node.id,
    question: node.text,
    label: option.label,
    concept: node.concept,
  });
  state.nodeId = option.next;
  show(option.next);
}

function renderTrail() {
  els.trail.replaceChildren();
  state.history.forEach((entry) => {
    const chip = document.createElement("li");
    chip.className = "trail-item";
    const q = document.createElement("span");
    q.className = "trail-question";
    q.textContent = interpolate(entry.question);
    const a = document.createElement("span");
    a.className = "trail-answer";
    a.textContent = entry.label;
    chip.append(q, a);
    els.trail.append(chip);
  });
}

function showResult(node) {
  els.step.hidden = true;
  els.unclassified.hidden = true;
  els.result.hidden = false;
  els.resultCategory.textContent = node.category;
  els.resultConcept.textContent = node.concept ? `a sub-category of ${node.concept}` : "";
  els.resultSubject.textContent = state.subject;
  els.resultPath.replaceChildren();
  state.history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${interpolate(entry.question)} → ${entry.label}`;
    els.resultPath.append(li);
  });
  els.copy.focus();
}

function showUnclassified() {
  els.step.hidden = true;
  els.result.hidden = true;
  els.unclassified.hidden = false;
  els.unclassifiedBack.focus();
}

function interpolate(text) {
  if (!text) return "";
  return text.replace(/\[\]/g, state.subject ? `“${state.subject}”` : "[]");
}

function start() {
  const value = els.subject.value.trim();
  if (!value) {
    els.subject.focus();
    return;
  }
  state.subject = value;
  state.history = [];
  state.nodeId = TREE.meta.id;
  localStorage.setItem(STORAGE_KEY, value);
  show(TREE.meta.id);
}

function back() {
  if (state.history.length === 0) {
    reset();
    return;
  }
  const last = state.history.pop();
  state.nodeId = last ? last.nodeId : TREE.meta.id;
  show(state.nodeId);
}

function reset() {
  state.history = [];
  state.nodeId = TREE.meta.id;
  els.step.hidden = true;
  els.result.hidden = true;
  els.unclassified.hidden = true;
  els.subject.value = localStorage.getItem(STORAGE_KEY) || "";
  els.subject.focus();
}

els.start.addEventListener("click", start);
els.subject.addEventListener("keydown", (event) => {
  if (event.key === "Enter") start();
});
els.back.addEventListener("click", back);
els.restart.addEventListener("click", () => {
  state.history = [];
  show(TREE.meta.id);
});
els.again.addEventListener("click", () => {
  state.history = [];
  state.nodeId = TREE.meta.id;
  els.result.hidden = true;
  els.step.hidden = true;
  els.intro.hidden = false;
  els.subject.focus();
});

els.unclassifiedBack.addEventListener("click", back);

els.desc.textContent = TREE.meta.description;

els.copy.addEventListener("click", async () => {
  const lines = [
    `Entity: ${state.subject}`,
    `Category: ${els.resultCategory.textContent}`,
    `Parent: ${els.resultConcept.textContent}`,
    "",
    ...Array.from(els.resultPath.querySelectorAll("li"))
           .map((li) => `- ${li.textContent}`),
  ];
  try {
    await navigator.clipboard.writeText(lines.join("\n"));
    els.copy.textContent = "Copied";
    setTimeout(() => (els.copy.textContent = "Copy result"), 1500);
  } catch {
    els.copy.textContent = "Copy failed";
  }
});

document.addEventListener("keydown", (event) => {
  if (els.step.hidden) return;
  const options = [...els.options.querySelectorAll(".option")];
  const index = options.indexOf(document.activeElement);
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    options[Math.min(index + 1, options.length - 1)]?.focus();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    options[Math.max(index - 1, 0)]?.focus();
  } else if (event.key === "Enter") {
    options[index]?.click();
  }
});

reset();

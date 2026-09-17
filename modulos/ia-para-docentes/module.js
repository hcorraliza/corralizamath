const STORAGE_KEY = "corralizamath.ia-docentes.v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* almacenamiento no disponible: continuar sin persistencia */
  }
}

const state = loadState();
state.checks = state.checks || {};
state.visited = state.visited || {};

/* ---------- Horizontal slide navigation ---------- */
const sidebarLinks = Array.from(document.querySelectorAll(".sidebar-nav a"));
const track = document.getElementById("slidesTrack");
const slides = track ? Array.from(track.children) : [];
const slideIndexById = {};
slides.forEach((s, i) => (slideIndexById[s.id] = i));

const dotsWrap = document.getElementById("slideDots");
if (dotsWrap) {
  slides.forEach((s, i) => {
    const dot = document.createElement("button");
    dot.className = "slide-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", "Ir a la sección " + (i + 1));
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
}
const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

const prevBtn = document.getElementById("slidePrev");
const nextBtn = document.getElementById("slideNext");
const counterEl = document.getElementById("slideCounter");
const progressFill = document.getElementById("progressFill");

let currentIndex = 0;

function markVisited(id) {
  if (!state.visited[id]) {
    state.visited[id] = true;
    saveState(state);
  }
  updateSidebarProgress();
}

function updateSidebarProgress() {
  const total = sidebarLinks.length;
  const done = sidebarLinks.filter((a) => state.visited[a.getAttribute("href").slice(1)]).length;
  const label = document.getElementById("sidebarProgressLabel");
  if (label) label.textContent = `${done} de ${total} secciones vistas`;
  sidebarLinks.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    a.classList.toggle("done", !!state.visited[id]);
  });
}

function animateBarsIn(slide) {
  slide.querySelectorAll(".bar-fill").forEach((fill) => {
    fill.style.width = fill.dataset.value + "%";
  });
}

function goToSlide(index) {
  if (!slides.length) return;
  index = Math.max(0, Math.min(slides.length - 1, index));
  currentIndex = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  const activeSlide = slides[index];
  activeSlide.scrollTop = 0;

  sidebarLinks.forEach((a) => a.classList.remove("active"));
  const activeLink = sidebarLinks.find((a) => a.getAttribute("href") === "#" + activeSlide.id);
  if (activeLink) activeLink.classList.add("active");

  dots.forEach((d, i) => d.classList.toggle("active", i === index));
  if (counterEl) counterEl.textContent = `${index + 1} / ${slides.length}`;
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === slides.length - 1;
  if (progressFill) progressFill.style.width = (index / (slides.length - 1)) * 100 + "%";

  history.replaceState(null, "", "#" + activeSlide.id);
  markVisited(activeSlide.id);
  animateBarsIn(activeSlide);
  if (moduleSidebar) moduleSidebar.classList.remove("open-mobile");
}

if (prevBtn) prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
if (nextBtn) nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
  if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
});

/* Intercept any in-page anchor that targets a known slide id */
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href").slice(1);
  if (id in slideIndexById) {
    e.preventDefault();
    goToSlide(slideIndexById[id]);
  }
});

/* ---------- Mobile sidebar toggle ---------- */
const sidebarToggle = document.getElementById("sidebarToggle");
const moduleSidebar = document.getElementById("moduleSidebar");
if (sidebarToggle && moduleSidebar) {
  sidebarToggle.addEventListener("click", () => {
    moduleSidebar.classList.toggle("open-mobile");
  });
}

/* Initial slide: honor a deep link hash if it matches a slide, else start at cover */
const initialId = location.hash.slice(1);
goToSlide(initialId in slideIndexById ? slideIndexById[initialId] : 0);
updateSidebarProgress();

/* ---------- Generic accordion (event delegation) ---------- */
document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".accordion-trigger");
  if (trigger) {
    trigger.closest(".accordion-item").classList.toggle("open");
    return;
  }

  const revealCard = e.target.closest(".reveal-card");
  if (revealCard) {
    revealCard.classList.toggle("open");
    return;
  }

  const senseLetter = e.target.closest(".sense-letter");
  if (senseLetter) {
    senseLetter.classList.toggle("open");
    return;
  }

  const tabBtn = e.target.closest(".tab-btn");
  if (tabBtn) {
    const group = tabBtn.closest(".tabs");
    const target = tabBtn.dataset.tabTarget;
    group.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    group.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tabBtn.classList.add("active");
    group.querySelector(`.tab-panel[data-tab="${target}"]`).classList.add("active");
    return;
  }

  const scaleItem = e.target.closest(".scale-item");
  if (scaleItem) {
    const row = scaleItem.closest(".scale-row");
    row.querySelectorAll(".scale-item").forEach((s) => s.classList.remove("selected"));
    scaleItem.classList.add("selected");
    return;
  }

  const stepperBtn = e.target.closest(".stepper-btn");
  if (stepperBtn) {
    const group = stepperBtn.closest(".stepper-group");
    group.querySelectorAll(".stepper-btn").forEach((b) => b.classList.remove("active"));
    stepperBtn.classList.add("active");
    const detail = group.querySelector(".stepper-detail");
    detail.textContent = stepperBtn.dataset.detail;
    return;
  }

  const scBtn = e.target.closest(".sc-btn");
  if (scBtn) {
    const q = scBtn.closest(".self-check-q");
    q.querySelectorAll(".sc-btn").forEach((b) => b.classList.remove("active-yes", "active-no"));
    scBtn.classList.add(scBtn.dataset.answer === "yes" ? "active-yes" : "active-no");
    q.dataset.answer = scBtn.dataset.answer;
    evaluateSelfCheck(q.closest(".self-check"));
    return;
  }

  const quizOption = e.target.closest(".quiz-option");
  if (quizOption && !quizOption.disabled) {
    const quiz = quizOption.closest(".quiz");
    const options = quiz.querySelectorAll(".quiz-option");
    const feedback = quiz.querySelector(".quiz-feedback");
    options.forEach((o) => (o.disabled = true));
    if (quizOption.dataset.correct === "true") {
      quizOption.classList.add("correct");
      feedback.textContent = quizOption.dataset.feedback || "¡Correcto!";
      feedback.classList.add("show", "ok");
    } else {
      quizOption.classList.add("incorrect");
      const correctOpt = quiz.querySelector('.quiz-option[data-correct="true"]');
      if (correctOpt) correctOpt.classList.add("correct");
      feedback.textContent = quizOption.dataset.feedback || "No exactamente. Revisa la opción resaltada.";
      feedback.classList.add("show", "bad");
    }
    return;
  }
});

function evaluateSelfCheck(box) {
  const questions = Array.from(box.querySelectorAll(".self-check-q"));
  const answered = questions.filter((q) => q.dataset.answer);
  if (answered.length < questions.length) return;
  const allYes = questions.every((q) => q.dataset.answer === "yes");
  const result = box.querySelector(".self-check-result");
  result.classList.add("show");
  result.textContent = allYes
    ? "Listo: puede usar este contenido con estudiantes o colegas con verificación adecuada."
    : "Todavía no: resuelva el vacío antes de usar el resultado con estudiantes o colegas.";
}

/* ---------- Persisted checklists ---------- */
document.querySelectorAll("[data-persist]").forEach((input) => {
  const key = input.dataset.persist;
  input.checked = !!state.checks[key];
  input.closest(".checklist-item")?.classList.toggle("checked", input.checked);
  input.addEventListener("change", () => {
    state.checks[key] = input.checked;
    saveState(state);
    input.closest(".checklist-item")?.classList.toggle("checked", input.checked);
    updateChecklistCounters();
  });
});

function updateChecklistCounters() {
  document.querySelectorAll("[data-checklist-counter]").forEach((counter) => {
    const groupName = counter.dataset.checklistCounter;
    const items = document.querySelectorAll(`[data-persist^="${groupName}"]`);
    const done = Array.from(items).filter((i) => i.checked).length;
    counter.textContent = `${done} de ${items.length} completadas`;
  });
}
updateChecklistCounters();

/* ---------- RC-TTF builder ---------- */
const builderFields = ["rol", "contexto", "tarea", "tono", "formato"];
const builderOutput = document.getElementById("builderOutput");

function renderBuilder() {
  if (!builderOutput) return;
  const values = builderFields.map((f) => document.getElementById("b-" + f)?.value.trim() || "");
  const hasAny = values.some((v) => v.length > 0);
  if (!hasAny) {
    builderOutput.innerHTML = '<span class="placeholder">Su instrucción aparecerá aquí a medida que complete los cinco campos…</span>';
    return;
  }
  const [rol, contexto, tarea, tono, formato] = values;
  let text = "";
  if (rol) text += `Actúa como ${rol}. `;
  if (contexto) text += `${contexto} `;
  if (tarea) text += `${tarea} `;
  if (tono) text += `Usa un tono ${tono}. `;
  if (formato) text += `Entrégalo en el siguiente formato: ${formato}.`;
  builderOutput.textContent = text.trim();
}

builderFields.forEach((f) => {
  const el = document.getElementById("b-" + f);
  if (el) el.addEventListener("input", renderBuilder);
});
renderBuilder();

const copyBtn = document.getElementById("builderCopy");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const text = builderOutput.textContent;
    if (!text || builderOutput.querySelector(".placeholder")) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copiado ✓";
      setTimeout(() => (copyBtn.textContent = "Copiar instrucción"), 1800);
    } catch (e) {
      /* clipboard no disponible */
    }
  });
}

const resetBtn = document.getElementById("builderReset");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    builderFields.forEach((f) => {
      const el = document.getElementById("b-" + f);
      if (el) el.value = "";
    });
    renderBuilder();
  });
}

/* ---------- Year in footer ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

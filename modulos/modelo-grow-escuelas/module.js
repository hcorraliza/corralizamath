const STORAGE_KEY = "corralizamath.modelo-grow-escuelas.v1";

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

const slidesViewport = document.getElementById("slidesViewport");
if (slidesViewport) {
  slidesViewport.addEventListener("scroll", () => {
    slidesViewport.scrollLeft = 0;
  });
}

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
  if (!result) return;
  result.classList.add("show");
  result.textContent = allYes
    ? box.dataset.msgYes || "Listo: puede usar este contenido con estudiantes o colegas con verificación adecuada."
    : box.dataset.msgNo || "Todavía no: resuelva el vacío antes de usar el resultado con estudiantes o colegas.";
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

/* ---------- Persisted worksheet text (textareas / inputs) ---------- */
state.texts = state.texts || {};
document.querySelectorAll("[data-persist-text]").forEach((field) => {
  const key = field.dataset.persistText;
  if (state.texts[key]) field.value = state.texts[key];
  let saveTimer;
  field.addEventListener("input", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      state.texts[key] = field.value;
      saveState(state);
    }, 400);
    refreshRecalls();
  });
});

/* ---------- Recall a previously written answer (e.g. echo the activator at closing) ---------- */
function refreshRecalls() {
  document.querySelectorAll("[data-recall-text]").forEach((el) => {
    const key = el.dataset.recallText;
    const field = document.querySelector(`[data-persist-text="${key}"]`);
    const live = field ? field.value : state.texts[key];
    el.textContent = live && live.trim()
      ? live
      : el.dataset.recallEmpty || "Aún no ha escrito una respuesta en esa sección — vuelva atrás para completarla.";
  });
}
refreshRecalls();

function updateChecklistCounters() {
  document.querySelectorAll("[data-checklist-counter]").forEach((counter) => {
    const groupName = counter.dataset.checklistCounter;
    const items = document.querySelectorAll(`[data-persist^="${groupName}"]`);
    const done = Array.from(items).filter((i) => i.checked).length;
    counter.textContent = `${done} de ${items.length} completadas`;
  });
}
updateChecklistCounters();

/* ---------- Generic template builder (reusable for several constructors) ---------- */
function initTemplateBuilder({ fieldIds, outputId, copyId, resetId, placeholder, template }) {
  const output = document.getElementById(outputId);
  if (!output) return;

  function render() {
    const values = fieldIds.map((id) => document.getElementById(id)?.value.trim() || "");
    const hasAny = values.some((v) => v.length > 0);
    if (!hasAny) {
      output.innerHTML = `<span class="placeholder">${placeholder}</span>`;
      return;
    }
    output.textContent = template(values).trim();
  }

  fieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", render);
  });
  render();

  const copyBtn = document.getElementById(copyId);
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = output.textContent;
      if (!text || output.querySelector(".placeholder")) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copiado ✓";
        setTimeout(() => (copyBtn.textContent = original), 1800);
      } catch (e) {
        /* clipboard no disponible */
      }
    });
  }

  const resetBtn = document.getElementById(resetId);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      fieldIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      render();
    });
  }
}

/* ---------- Verificador de meta SMART ---------- */
function initSmartCheck(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const boxes = Array.from(root.querySelectorAll('input[type="checkbox"]'));
  const output = root.querySelector(".smart-check-output");
  function render() {
    const done = boxes.filter((b) => b.checked).length;
    if (!output) return;
    if (done === 0) {
      output.innerHTML = '<span class="placeholder">Marque cada característica SMART que su meta ya cumple.</span>';
      return;
    }
    output.textContent =
      done === boxes.length
        ? `Su meta cumple las ${boxes.length} características SMART. Está lista para pasar a la fase de Realidad.`
        : `Su meta cumple ${done} de ${boxes.length} características SMART. Revise las que faltan antes de continuar.`;
  }
  boxes.forEach((b) => b.addEventListener("change", render));
  render();
}

document.querySelectorAll("[data-smart-check]").forEach((el) => initSmartCheck(el.id));

/* ---------- Countdown timer (Cápsula cero, Receso) ---------- */
function initCountdown(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;
  const totalSeconds = parseInt(root.dataset.seconds, 10);
  const display = root.querySelector(".timer-display");
  const startBtn = root.querySelector(".timer-start");
  const resetBtn = root.querySelector(".timer-reset");
  const steps = Array.from(root.querySelectorAll(".timer-step"));
  let remaining = totalSeconds;
  let intervalId = null;

  function format(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  function highlightStep() {
    const elapsed = totalSeconds - remaining;
    steps.forEach((step) => {
      const from = parseInt(step.dataset.from, 10);
      const to = parseInt(step.dataset.to, 10);
      step.classList.toggle("current", elapsed >= from && elapsed < to);
      step.classList.toggle("done", elapsed >= to);
    });
  }

  function tick() {
    remaining -= 1;
    if (display) display.textContent = format(Math.max(remaining, 0));
    highlightStep();
    if (remaining <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      if (startBtn) startBtn.textContent = "Terminado ✓";
      root.classList.add("timer-done");
    }
  }

  if (display) display.textContent = format(remaining);
  highlightStep();

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        startBtn.textContent = "Reanudar";
        return;
      }
      root.classList.remove("timer-done");
      startBtn.textContent = "Pausar";
      intervalId = setInterval(tick, 1000);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearInterval(intervalId);
      intervalId = null;
      remaining = totalSeconds;
      if (display) display.textContent = format(remaining);
      if (startBtn) startBtn.textContent = "Iniciar";
      root.classList.remove("timer-done");
      highlightStep();
    });
  }
}

document.querySelectorAll("[data-countdown]").forEach((el) => initCountdown(el.id));

/* ---------- Final exam ---------- */
function initFinalExam(examId) {
  const exam = document.getElementById(examId);
  if (!exam) return;
  const quizzes = Array.from(exam.querySelectorAll(".quiz"));
  const total = quizzes.length;
  const passScore = parseInt(exam.dataset.passScore, 10) || Math.ceil(total * 0.8);
  const resultBox = exam.querySelector(".exam-result");
  const scoreEl = resultBox.querySelector(".exam-score");
  const messageEl = resultBox.querySelector(".exam-message");
  const certPanel = exam.querySelector(".cert-panel");
  const progressLabel = exam.querySelector(".exam-progress");

  function updateProgress() {
    const answered = quizzes.filter((q) => q.classList.contains("answered")).length;
    if (progressLabel) progressLabel.textContent = `${answered} de ${total} preguntas respondidas`;
    if (answered === total) finish();
  }

  function finish() {
    const correct = quizzes.filter((q) => q.classList.contains("correct-answer")).length;
    const passed = correct >= passScore;
    resultBox.classList.add("show");
    resultBox.classList.toggle("pass", passed);
    resultBox.classList.toggle("fail", !passed);
    if (scoreEl) scoreEl.textContent = `${correct} / ${total}`;
    if (messageEl) {
      messageEl.textContent = passed
        ? "¡Aprobado! Ya puede generar su certificado."
        : `No alcanzó el mínimo de ${passScore} de ${total} correctas. Repase el módulo y vuelva a intentarlo.`;
    }
    if (certPanel) {
      certPanel.classList.toggle("show", passed);
      certPanel.dataset.scoreText = `${correct}/${total}`;
    }
  }

  exam.addEventListener("click", (e) => {
    const opt = e.target.closest(".quiz-option");
    if (opt) {
      const quiz = opt.closest(".quiz");
      if (quiz.classList.contains("answered")) return;
      quiz.classList.add("answered", opt.dataset.correct === "true" ? "correct-answer" : "incorrect-answer");
      updateProgress();
      return;
    }
    const retryBtn = e.target.closest(".exam-retry-btn");
    if (retryBtn) {
      quizzes.forEach((q) => {
        q.classList.remove("answered", "correct-answer", "incorrect-answer");
        q.querySelectorAll(".quiz-option").forEach((o) => {
          o.disabled = false;
          o.classList.remove("correct", "incorrect");
        });
        const fb = q.querySelector(".quiz-feedback");
        if (fb) {
          fb.classList.remove("show", "ok", "bad");
          fb.textContent = "";
        }
      });
      resultBox.classList.remove("show", "pass", "fail");
      if (certPanel) certPanel.classList.remove("show");
      updateProgress();
    }
  });

  updateProgress();
}

document.querySelectorAll(".final-exam").forEach((exam) => initFinalExam(exam.id));

/* ---------- Certificate (print view) ---------- */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderCertificate({ name, moduleTitle, scoreText, facilitatorName, facilitatorTitle }) {
  const stage = document.getElementById("certificateStage");
  if (!stage) return;
  const today = new Date().toLocaleDateString("es-PR", { year: "numeric", month: "long", day: "numeric" });
  stage.innerHTML = `
    <div class="certificate">
      <img class="cert-logo" src="../../img/logo-ore-ponce.png" alt="Programa de Matemáticas ORE-Ponce">
      <img class="cert-institution" src="../../img/membrete-depr.png" alt="Departamento de Educación · Gobierno de Puerto Rico · Asuntos Académicos y Programáticos · ORE-Ponce">
      <h1>Certificado de Aprovechamiento</h1>
      <p class="cert-sub">Otorgado por CorralizaMath a través de su módulo interactivo de autoestudio</p>
      <p class="cert-name">${escapeHtml(name)}</p>
      <p class="cert-body">completó satisfactoriamente el módulo <strong>${escapeHtml(moduleTitle)}</strong> y aprobó su evaluación final con una puntuación de <strong>${escapeHtml(scoreText)}</strong>.</p>
      <div class="cert-footer">
        <div class="cert-sign">
          <img class="sig-img" src="../../img/signature.svg" alt="Firma">
          <div class="sig-rule"></div>
          <span class="sig-name">${escapeHtml(facilitatorName)}</span>
          <span class="sig-line">${escapeHtml(facilitatorTitle)}</span>
        </div>
        <div class="cert-date"><span class="date-line">${today}</span></div>
      </div>
    </div>`;
  document.body.classList.add("printing-cert");
  window.print();
}

window.addEventListener("afterprint", () => document.body.classList.remove("printing-cert"));

document.querySelectorAll(".cert-generate-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.closest(".cert-panel");
    const nameInput = panel.querySelector('input[type="text"]');
    const name = (nameInput.value || "").trim();
    if (!name) {
      nameInput.focus();
      nameInput.style.borderColor = "#c0392b";
      return;
    }
    nameInput.style.borderColor = "";
    renderCertificate({
      name,
      moduleTitle: panel.dataset.moduleTitle,
      scoreText: panel.dataset.scoreText || "",
      facilitatorName: panel.dataset.facilitatorName,
      facilitatorTitle: panel.dataset.facilitatorTitle,
    });
  });
});

/* ---------- Year in footer ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

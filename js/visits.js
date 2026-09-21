/* ---------- Contador público de visitas (GoatCounter) ----------
   Servicio externo gratuito y sin cookies: https://www.goatcounter.com
   Antes de que estos números aparezcan, hay que:
   1. Crear una cuenta gratuita en goatcounter.com con el código de sitio "corralizamath"
      (o cambiar GOATCOUNTER_HOST abajo si se usa otro código).
   2. Activar la visibilidad pública del contador en la configuración del sitio,
      siguiendo la documentación vigente de GoatCounter.
   Mientras eso no esté activo, las páginas muestran un mensaje de contador no disponible
   en lugar de fallar. */
const GOATCOUNTER_HOST = "https://corralizamath.goatcounter.com";

async function fetchVisitCount(path) {
  try {
    const res = await fetch(`${GOATCOUNTER_HOST}/counter/${encodeURIComponent(path)}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    const n = parseInt(String(data.count).replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  } catch (e) {
    return null;
  }
}

async function fetchZoneCount(paths) {
  const counts = await Promise.all(paths.map(fetchVisitCount));
  if (counts.every((c) => c === null)) return null;
  return counts.reduce((sum, c) => sum + (c || 0), 0);
}

/* Muestra "N visitas a esta sección" en un elemento de la página actual */
async function renderVisitBadge(elementId, paths) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const list = Array.isArray(paths) ? paths : [paths || location.pathname];
  const count = await fetchZoneCount(list);
  el.textContent = count !== null
    ? `${count.toLocaleString("es-PR")} visita${count === 1 ? "" : "s"} a esta sección`
    : "Contador de visitas no disponible todavía";
}

/* Muestra una cuadrícula con el conteo de varias zonas del portal */
async function renderVisitSummary(containerId, zones) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const results = await Promise.all(
    zones.map(async (z) => ({ label: z.label, count: await fetchZoneCount(z.paths) }))
  );
  container.innerHTML = results
    .map(
      (z) => `
    <div class="visit-zone">
      <span class="visit-zone-name">${z.label}</span>
      <span class="visit-zone-count">${z.count !== null ? z.count.toLocaleString("es-PR") : "—"}</span>
    </div>`
    )
    .join("");
}

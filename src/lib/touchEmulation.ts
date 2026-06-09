/**
 * "Drag-to-scroll" para iframes del MISMO ORIGEN (vista mobile del celular).
 *
 * Los proyectos usan scroll nativo (`overflow-x: auto; scroll-snap`) para los
 * carruseles, sin handlers de drag. En un teléfono se swipea con el dedo, pero
 * en desktop el scroll nativo solo responde a rueda/scrollbar (los eventos
 * `touch` sintéticos NO lo disparan). Así que emulamos el gesto: al arrastrar
 * con el mouse, movemos manualmente el `scrollLeft`/`scrollTop` del contenedor
 * scrolleable bajo el puntero.
 *
 * Además ocultamos las scrollbars dentro del iframe para que se vea como mobile.
 */
export function enableTouchEmulation(iframe: HTMLIFrameElement): void {
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!win || !doc) return;

  // Evita aplicarlo dos veces (onLoad puede dispararse en navegaciones internas).
  const w = win as unknown as Record<string, unknown>;
  if (w.__dragScrollApplied) return;
  w.__dragScrollApplied = true;

  // Ocultar scrollbars (look mobile) sin romper el scroll.
  const style = doc.createElement("style");
  style.textContent = `
    *::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none !important; }
    html, body, * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
  `;
  doc.head?.appendChild(style);

  const isScrollable = (el: Element, axis: "x" | "y"): boolean => {
    const s = win.getComputedStyle(el);
    const overflow = axis === "x" ? s.overflowX : s.overflowY;
    if (overflow !== "auto" && overflow !== "scroll") return false;
    return axis === "x"
      ? el.scrollWidth > el.clientWidth + 1
      : el.scrollHeight > el.clientHeight + 1;
  };

  const scrollTarget = (start: Element | null, axis: "x" | "y"): Element => {
    let el: Element | null = start;
    while (el && el !== doc.documentElement) {
      if (isScrollable(el, axis)) return el;
      el = el.parentElement;
    }
    return (doc.scrollingElement as Element | null) ?? doc.documentElement;
  };

  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let hTarget: Element | null = null;
  let vTarget: Element | null = null;

  doc.addEventListener(
    "mousedown",
    (e) => {
      const me = e as MouseEvent;
      if (me.button !== 0) return;
      dragging = true;
      moved = false;
      lastX = me.clientX;
      lastY = me.clientY;
      const target = me.target as Element | null;
      hTarget = scrollTarget(target, "x");
      vTarget = scrollTarget(target, "y");
    },
    true,
  );

  doc.addEventListener(
    "mousemove",
    (e) => {
      if (!dragging) return;
      const me = e as MouseEvent;
      const dx = me.clientX - lastX;
      const dy = me.clientY - lastY;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      moved = true;
      lastX = me.clientX;
      lastY = me.clientY;
      // Arrastrar el contenido con el cursor (sentido invertido al scroll).
      if (hTarget) hTarget.scrollLeft -= dx;
      if (vTarget) vTarget.scrollTop -= dy;
      // Evita selección de texto / arrastre de imágenes durante el drag.
      me.preventDefault();
    },
    true,
  );

  const stop = (e: Event) => {
    if (!dragging) return;
    dragging = false;
    // Si hubo arrastre, cancelamos el click que dispararía el navegador.
    if (moved) {
      const cancelClick = (ce: Event) => {
        ce.stopPropagation();
        ce.preventDefault();
        doc.removeEventListener("click", cancelClick, true);
      };
      doc.addEventListener("click", cancelClick, true);
      // Por si no llega el click, limpiamos en el próximo tick.
      win.setTimeout(() => doc.removeEventListener("click", cancelClick, true), 0);
    }
    void e;
  };
  doc.addEventListener("mouseup", stop, true);
  doc.addEventListener("mouseleave", stop, true);
}

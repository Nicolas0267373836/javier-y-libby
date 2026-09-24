/* ==========================================================================
   Herramientas de revisión del prototipo (WebDom)
   - Anotaciones de animación y estados sobre la página
   - Lista de datos por confirmar
   - Sistema de diseño con componentes en vivo
   Para producción: elimina revision.js y revision.css del index.html.
   ========================================================================== */
(() => {
  'use strict';
  if (/[?&]embed\b/.test(location.search)) return; /* dentro de vista-responsive.html */
  const d = document;
  const w = window;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const icon = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const ANOTACIONES = [
    { sel: '[data-annot="nav"]', t: 'Navegación sticky', a: 'Al bajar 8 px pasa de transparente a blanco translúcido con desenfoque y sombra (420 ms). La píldora blanca sigue al cursor y marca la sección activa (scrollspy).', s: 'Enlace normal, hover (tinta), activo (píldora + peso 650), foco visible. En ≤ 1080 px: menú desplegable con enlaces escalonados cada 40 ms, hamburguesa que se convierte en X, fondo oscurecido y cierre con Esc.' },
    { sel: '[data-annot="hero"]', t: 'Carga del hero', a: 'Secuencia escalonada: navbar baja 8 px (700 ms) → etiqueta → título línea por línea → subtítulo → botones → teléfonos. 110 ms entre elementos, 900 ms cada uno, fade + 22 px.', s: 'Curva cubic-bezier(.22, 1, .36, 1). Se reproduce una sola vez y deja todo visible en reposo.' },
    { sel: '[data-annot="hero-img"]', t: 'Fotografías del hero', a: 'Desenfoque 16 px → nítido y escala 1,06 → 1 en 1,3 s. Parallax 0,05 / 0,10 / 0,16 según profundidad (solo ≥ 900 px). Flotación de 7 px en ciclos de 7 y 8,4 s.', s: 'Hover: zoom máximo 3 %, brillo +4 % y overlay inferior. El sello «&» gira en 26 s. No se deforman rostros; en móvil se desactiva la flotación.' },
    { sel: '[data-annot="marquee"]', t: 'Cinta de áreas', a: 'Desplazamiento continuo en 52 s con bordes desvanecidos.', s: 'Se pausa al pasar el cursor. Con movimiento reducido se convierte en una lista estática.' },
    { sel: '[data-annot="btn"]', t: 'Botones: 7 estados', a: 'Hover: sube 2 px, sombra verde y la flecha avanza 3 px dentro del círculo. Active: escala 0,97 en 80 ms.', s: 'Focus: anillo blanco + verde (3/6 px). Loading: spinner y clic bloqueado. Success: verde oscuro con check y rebote. Disabled: gris, sin sombra, cursor bloqueado. Ver todos en «Sistema de diseño».' },
    { sel: '[data-annot="stats"]', t: 'Indicadores', a: 'Cada número se pone en 0 justo antes de entrar en pantalla y cuenta hasta su valor en 1,4 s (easeOutExpo) cuando está visible al 60 %.', s: 'Valores editables en data-count. «Áreas de atención» se calcula desde la lista de tratamientos. Sin JavaScript se ven los valores finales.' },
    { sel: '[data-annot="photo-hover"]', t: 'Hover en fotografías', a: 'Zoom máximo 3 %, brillo +4 % y overlay inferior en 420 ms. Las imágenes diferidas cargan de desenfocado a nítido.', s: 'Solo se anima transform, opacity y filter. Nada se deforma.' },
    { sel: '[data-annot="tabs"]', t: 'Pestañas de especialistas', a: 'La píldora blanca se desliza en 700 ms. El panel entra con fade + 16 px y la foto secundaria llega 120 ms después.', s: 'Accesible con teclado: ←/→, Inicio y Fin. Los botones «Agendar con…» preseleccionan al especialista en el formulario.' },
    { sel: '[data-annot="filter"]', t: 'Filtros de tratamientos', a: 'Píldora deslizante. Las tarjetas que salen se desvanecen (170 ms); las que quedan se reacomodan con FLIP (560 ms) y las nuevas entran escalonadas cada 55 ms.', s: 'La tarjeta «¿No sabes qué especialista necesitas?» aparece solo si completa la última fila.' },
    { sel: '[data-annot="cards"]', t: 'Tarjetas de tratamiento', a: 'Hover: sube 6 px con sombra profunda, el ícono sube 2 px y rota −5°, el patrón se amplía 3 % y la flecha avanza 4 px y se rellena de verde.', s: 'Clic o Enter: abre la pantalla de detalle desde la posición de la tarjeta. Cada tarjeta tiene enlace directo (#tratamiento-id).' },
    { sel: '[data-annot="process"]', t: 'Primera consulta', a: 'Tres pasos reales publicados por el Dr. Abud: preparación, diagnóstico y plan.', s: 'Numeración solo porque el orden importa. En móvil las flechas giran hacia abajo.' },
    { sel: '[data-annot="tech"]', t: 'Sección oscura que se expande', a: 'Al entrar, el panel azul noche pasa de tener márgenes de 36 px y esquinas de 44 px a ocupar todo el ancho, ligado al scroll. La ilustración se dibuja trazo a trazo (1,5 s) y las etiquetas aparecen escalonadas.', s: 'Selección por clic, hover con intención (140 ms) o teclado ↑/↓. En móvil y con movimiento reducido el panel queda fijo.' },
    { sel: '[data-annot="gallery"]', t: 'Galería', a: 'Carrusel horizontal con scroll-snap, arrastre con mouse y deslizamiento nativo en táctil; al soltar se ajusta a la foto más cercana.', s: 'Botones deshabilitados en los extremos y barra de progreso. Lightbox con fade + escala 0,94 → 1, flechas, contador, Esc, gestos y foco atrapado.' },
    { sel: '[data-annot="testimonials"]', t: 'Testimonios', a: 'Autoplay de 7 s con barra de progreso. Transición fade + 28 px.', s: 'Pausa al pasar el cursor o enfocar; se detiene al usar flechas, puntos o deslizar. Botón pausar/reanudar (WCAG 2.2.2). Son espacios editables: no hay reseñas inventadas.' },
    { sel: '[data-annot="faq"]', t: 'Preguntas frecuentes', a: 'Altura animada con grid-template-rows (440 ms). El + rota 135° y se convierte en × sobre verde.', s: 'Hover, foco visible y aria-expanded. En móvil solo una respuesta abierta a la vez.' },
    { sel: '[data-annot="schedule"]', t: 'Días de consulta', a: 'Tabla por especialista y sede con los horarios publicados.', s: 'Los puntos punteados indican «por confirmar». Alimenta el calendario del formulario (HORARIOS en script.js).' },
    { sel: '[data-annot="form"]', t: 'Formulario de 4 pasos', a: 'Barra de progreso (600 ms). Los pasos salen 22 px y entran 26 px en la dirección del avance. Validación al salir de cada campo; error con vibración de 4 px y mensaje claro.', s: 'Calendario según el horario de cada especialista y sede. Envío: loading 1,6 s → success → pantalla de confirmación con check dibujado. No envía ni guarda datos.' },
    { sel: '[data-annot="modal"]', t: 'Pantalla de detalle', a: 'Entra con escala 0,95 → 1 y fade (520 ms) desde la tarjeta pulsada; en móvil sube como hoja inferior.', s: 'Anterior/siguiente con ←/→, Esc para cerrar, foco atrapado. «Agendar para este tratamiento» preselecciona especialista y motivo.' },
    { sel: '[data-annot="wa"]', t: 'WhatsApp flotante', a: 'Aparece al salir del hero y se oculta sobre el formulario y el pie. Al pasar el cursor se expande y muestra «WhatsApp». Pulso sutil cada 8 s.', s: 'Abre un selector por sede. Números de WhatsApp por confirmar.' }
  ];

  const PENDIENTES_FIJOS = [
    ['WhatsApp oficial', 'Instagram publica 849-449-7353 (Bávaro) y 829-515-0011 (San Pedro); doctorabud.com indica 829-257-6632 como WhatsApp. Confirmar cuál usar por sede.'],
    ['Horarios del Dr. Abud', 'No están publicados para Bávaro ni San Pedro. doctorabud.com muestra sedes antiguas (Punta Cana Doctors, Hospital IMG).'],
    ['Dirección del Dr. Abud en San Pedro', 'Confirmar si también atiende en el Centro Hospitalario UCE.'],
    ['Horarios de la Dra. Libby', 'Tomados de una publicación de octubre de 2025. Confirmar vigencia.'],
    ['ARS aceptadas', 'Ambos perfiles tienen el destacado «Seguros»; falta la lista.'],
    ['Formación y certificaciones', 'Dra. Libby: pendiente. Dr. Abud: validar la formación tomada de doctorabud.com y sumar certificaciones.'],
    ['Procedimientos específicos', 'Urología femenina y articulaciones de reemplazo. Revisión médica de todos los textos de tratamientos.'],
    ['Fotografías', 'Pedir originales en alta resolución (las actuales vienen de Instagram) y fotos de sedes y quirófano con autorización.'],
    ['Testimonios', 'Solo reales y con autorización escrita.'],
    ['Marca', 'Aprobar el nombre «Abud & Martínez» y el logotipo tipográfico propuesto.'],
    ['Dominio y publicación', 'abudinfo.com hoy redirige a Linktree; doctorabud.com tiene datos antiguos. Definir dominio antes de publicar.']
  ];

  const COLORES = [
    ['--verde-600', '#1E7A43', 'Botón principal, 5,4:1 con blanco'],
    ['--teal-600', '#127369', 'Final del degradado del CTA, 5,7:1'],
    ['--verde-700', '#1B6B3C', 'Texto verde y eyebrows, 6,5:1'],
    ['--verde-300', '#86C267', 'Acentos sobre azul noche, 8,2:1'],
    ['--verde-bruma', '#C8E6B0', 'Acentos sobre el degradado de marca, 5:1'],
    ['--verde-400', '#3FA64A', 'Verde Innovacare, solo decorativo'],
    ['--azul-900', '#0C1A33', 'Secciones oscuras y pie'],
    ['--azul-700', '#1D3566', 'Final del degradado de marca'],
    ['--tinta', '#0E1F38', 'Títulos, 16,5:1'],
    ['--pizarra', '#42495B', 'Texto de lectura, 9:1'],
    ['--gris', '#5E6778', 'Texto secundario, 5,7:1'],
    ['--niebla', '#F2F6F8', 'Fondo de sección alterna'],
    ['--menta', '#EFF7F1', 'Fondo de testimonios'],
    ['--pendiente', '#8A5A00', 'Datos por confirmar (sobre #FFF6E0)']
  ];

  /* --------------------------- Estructura -------------------------------- */
  const ui = d.createElement('div');
  ui.className = 'rv';
  ui.innerHTML = `
    <div class="rv__menu" id="rv-menu" hidden>
      <p class="rv__title">Herramientas de revisión</p>
      <button type="button" data-rv="annot" aria-pressed="false">${icon('pin')}<span>Anotaciones de movimiento</span><b class="rv__n">${ANOTACIONES.length}</b></button>
      <button type="button" data-rv="pend">${icon('list-checks')}<span>Datos por confirmar</span><b class="rv__n" id="rv-pend-n">0</b></button>
      <button type="button" data-rv="sys">${icon('palette')}<span>Sistema de diseño</span></button>
      <button type="button" data-rv="mark" aria-pressed="false">${icon('eye')}<span>Resaltar pendientes en la página</span></button>
      <p class="rv__foot">Solo para revisión. En producción se eliminan revision.js y revision.css.</p>
    </div>
    <button type="button" class="rv__toggle" aria-expanded="false" aria-controls="rv-menu">${icon('sliders')}<span>Revisión</span></button>`;
  d.body.appendChild(ui);

  const layer = d.createElement('div');
  layer.className = 'rv-layer';
  layer.hidden = true;
  d.body.appendChild(layer);

  const pop = d.createElement('div');
  pop.className = 'rv-pop';
  pop.hidden = true;
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-live', 'polite');
  d.body.appendChild(pop);

  const drawer = d.createElement('aside');
  drawer.className = 'rv-drawer';
  drawer.hidden = true;
  drawer.setAttribute('aria-label', 'Panel de revisión');
  drawer.innerHTML = `
    <div class="rv-drawer__head">
      <div class="rv-tabs" role="tablist" aria-label="Secciones del panel">
        <button role="tab" type="button" data-tab="annot" aria-selected="true">Anotaciones</button>
        <button role="tab" type="button" data-tab="pend" aria-selected="false" tabindex="-1">Pendientes</button>
        <button role="tab" type="button" data-tab="sys" aria-selected="false" tabindex="-1">Sistema</button>
      </div>
      <button type="button" class="icon-btn icon-btn--sm rv-drawer__close" aria-label="Cerrar panel">${icon('x')}</button>
    </div>
    <div class="rv-drawer__body">
      <section class="rv-pane" data-pane="annot"></section>
      <section class="rv-pane" data-pane="pend" hidden></section>
      <section class="rv-pane" data-pane="sys" hidden></section>
    </div>`;
  d.body.appendChild(drawer);

  const toggle = $('.rv__toggle', ui);
  const menu = $('#rv-menu', ui);

  /* --------------------------- Menú --------------------------------------- */
  const setMenu = (open) => { menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  d.addEventListener('click', (e) => { if (!menu.hidden && !ui.contains(e.target)) setMenu(false); });

  /* --------------------------- Anotaciones -------------------------------- */
  let pinsOn = false;
  const targets = ANOTACIONES.map((a, i) => ({ ...a, n: i + 1, el: $(a.sel) })).filter((a) => a.el);
  targets.forEach((a) => {
    const b = d.createElement('button');
    b.type = 'button';
    b.className = 'rv-pin';
    b.textContent = a.n;
    b.setAttribute('aria-label', `Anotación ${a.n}: ${a.t}`);
    b.addEventListener('click', (e) => { e.stopPropagation(); showPop(a, b); });
    b.addEventListener('mouseenter', () => a.el.classList.add('rv-highlight'));
    b.addEventListener('mouseleave', () => a.el.classList.remove('rv-highlight'));
    a.pin = b;
    layer.appendChild(b);
  });
  const place = () => {
    if (!pinsOn) return;
    const vh = w.innerHeight;
    targets.forEach((a) => {
      const el = a.el.getClientRects().length ? a.el : null;
      if (!el) { a.pin.hidden = true; return; }
      const r = el.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < vh && r.width > 0;
      a.pin.hidden = !visible;
      if (!visible) return;
      const top = Math.max(8, Math.min(vh - 44, r.top + 10));
      const left = Math.max(8, Math.min(w.innerWidth - 44, r.left + 10));
      a.pin.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    });
  };
  let queued = false;
  const queue = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; place(); }); };
  w.addEventListener('scroll', queue, { passive: true });
  w.addEventListener('resize', queue);

  const showPop = (a, pin) => {
    pop.innerHTML = `
      <p class="rv-pop__n">Anotación ${a.n} de ${targets.length}</p>
      <h3>${esc(a.t)}</h3>
      <p><b>Movimiento</b>${esc(a.a)}</p>
      <p><b>Estados y comportamiento</b>${esc(a.s)}</p>
      <div class="rv-pop__actions">
        <button type="button" class="rv-link" data-go="${a.n - 2}">← Anterior</button>
        <button type="button" class="rv-link" data-go="${a.n}">Siguiente →</button>
        <button type="button" class="rv-link" data-open-all>Ver todas</button>
      </div>`;
    pop.hidden = false;
    const r = pin.getBoundingClientRect();
    const pw = Math.min(360, w.innerWidth - 24);
    pop.style.width = `${pw}px`;
    let left = r.left + 44;
    if (left + pw > w.innerWidth - 12) left = Math.max(12, r.left - pw - 10);
    let top = r.top;
    const ph = pop.offsetHeight;
    if (top + ph > w.innerHeight - 12) top = Math.max(12, w.innerHeight - ph - 12);
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
    $$('.rv-highlight').forEach((x) => x.classList.remove('rv-highlight'));
    a.el.classList.add('rv-highlight');
  };
  pop.addEventListener('click', (e) => {
    e.stopPropagation();
    const go = e.target.closest('[data-go]');
    if (go) {
      const k = (Number(go.dataset.go) + targets.length) % targets.length;
      focusAnnotation(targets[k]);
    }
    if (e.target.closest('[data-open-all]')) { pop.hidden = true; openDrawer('annot'); }
  });
  d.addEventListener('click', (e) => {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('.rv-pin')) {
      pop.hidden = true;
      $$('.rv-highlight').forEach((x) => x.classList.remove('rv-highlight'));
    }
  });
  const focusAnnotation = (a) => {
    setPins(true);
    a.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { place(); showPop(a, a.pin); }, 650);
  };
  const setPins = (on) => {
    pinsOn = on;
    layer.hidden = !on;
    $('[data-rv="annot"]', ui).setAttribute('aria-pressed', String(on));
    if (on) place(); else { pop.hidden = true; $$('.rv-highlight').forEach((x) => x.classList.remove('rv-highlight')); }
  };

  /* --------------------------- Pendientes --------------------------------- */
  const collectPending = () => {
    const items = [];
    $$('main .tbc, footer .tbc, #wa .tbc').forEach((el) => {
      const sec = el.closest('section, footer, #wa');
      const h = sec ? $('h2, h3, [id$="-title"]', sec) : null;
      items.push({ el, text: el.textContent.trim(), where: h ? h.textContent.trim() : 'Página' });
    });
    $$('[data-tbc]').forEach((el) => {
      const sec = el.closest('section');
      const h = sec ? $('h2', sec) : null;
      items.push({ el, text: el.dataset.tbc, where: h ? h.textContent.trim() : 'Página', note: true });
    });
    return items;
  };
  const renderPending = () => {
    const items = collectPending();
    $('#rv-pend-n').textContent = String(items.length + PENDIENTES_FIJOS.length);
    const pane = $('[data-pane="pend"]', drawer);
    pane.innerHTML = `
      <p class="rv-lead">Todo lo que no está confirmado por la clínica está marcado en la página. Nada se inventó: estos datos deben llegar del cliente antes de publicar.</p>
      <h3 class="rv-h">Lista para el cliente</h3>
      <ol class="rv-list">${PENDIENTES_FIJOS.map(([t, x]) => `<li><strong>${esc(t)}</strong><span>${esc(x)}</span></li>`).join('')}</ol>
      <h3 class="rv-h">Marcas en la página <small>${items.length}</small></h3>
      <ul class="rv-list rv-list--links">${items.map((it, k) => `<li><button type="button" data-pend="${k}"><span class="${it.note ? 'rv-note' : 'tbc'}">${esc(it.text)}</span><small>${esc(it.where)}</small></button></li>`).join('')}</ul>`;
    pane.onclick = (e) => {
      const b = e.target.closest('[data-pend]');
      if (!b) return;
      const it = items[Number(b.dataset.pend)];
      const hiddenPanel = it.el.closest('[role="tabpanel"][hidden]');
      if (hiddenPanel) { const tab = d.getElementById(hiddenPanel.getAttribute('aria-labelledby')); if (tab) tab.click(); }
      closeDrawer();
      setTimeout(() => {
        it.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        it.el.classList.remove('rv-flash'); void it.el.offsetWidth; it.el.classList.add('rv-flash');
      }, 80);
    };
  };

  /* --------------------------- Sistema de diseño -------------------------- */
  const btnRow = (variant, label, withIcon = true) => {
    const states = [['Normal', ''], ['Hover', 'is-hover'], ['Active', 'is-active'], ['Focus', 'is-focus'], ['Loading', 'is-loading'], ['Success', 'is-success'], ['Disabled', 'is-disabled']];
    return states.map(([n, cls]) => `
      <figure class="rv-state">
        <button type="button" class="btn ${variant} btn--sm ${cls}" tabindex="-1" ${cls === 'is-disabled' ? 'aria-disabled="true"' : ''}><span class="btn__label">${cls === 'is-success' ? 'Listo' : cls === 'is-loading' && withIcon ? 'Enviando…' : label}</span>${withIcon ? `<span class="btn__icon">${icon(cls === 'is-success' ? 'check' : 'arrow-right')}</span>` : ''}</button>
        <figcaption>${n}</figcaption>
      </figure>`).join('');
  };
  const renderSystem = () => {
    const pane = $('[data-pane="sys"]', drawer);
    pane.innerHTML = `
      <p class="rv-lead">Tokens en <code>:root</code> de styles.css. Colores de Innovacare Internacional Center y del gráfico del Dr. Abud (verde salvia → teal → azul noche).</p>

      <h3 class="rv-h">Color</h3>
      <div class="rv-grads">
        <div style="background:var(--grad-marca-deep)"><span>Degradado de marca (secciones con texto)</span></div>
        <div style="background:var(--grad-cta)"><span>Degradado del CTA</span></div>
        <div style="background:var(--grad-innova)"><span>Degradado Innovacare</span></div>
      </div>
      <ul class="rv-swatches">${COLORES.map(([v, hex, use]) => `<li><span class="rv-sw" style="background:${hex}"></span><span><code>${v}</code> <b>${hex}</b><small>${esc(use)}</small></span></li>`).join('')}</ul>

      <h3 class="rv-h">Tipografía</h3>
      <div class="rv-type">
        <p class="rv-type__row"><span class="rv-type__meta">Display · Bricolage Grotesque 560 · −0,045 em</span><span style="font-family:var(--f-display);font-size:2.4rem;font-weight:560;letter-spacing:-.045em;line-height:1;color:var(--tinta)">Dos especialistas</span></p>
        <p class="rv-type__row"><span class="rv-type__meta">Acento · Lora Italic 500</span><span class="serif" style="font-size:2rem">una misma forma</span></p>
        <p class="rv-type__row"><span class="rv-type__meta">Texto · Figtree 400 · 16/1,62</span><span>Cirujano ortopeda y cirujana uróloga en Bávaro y San Pedro de Macorís.</span></p>
        <p class="rv-type__row"><span class="rv-type__meta">Etiqueta · Figtree 700 · 0,16 em</span><span class="eyebrow" style="margin:0">Tratamientos</span></p>
      </div>
      <table class="rv-table"><thead><tr><th>Nivel</th><th>Tamaño</th><th>Uso</th></tr></thead><tbody>
        <tr><td>H1</td><td>clamp(2,55 → 4,85 rem)</td><td>Hero</td></tr>
        <tr><td>H2</td><td>clamp(2 → 3,3 rem)</td><td>Títulos de sección</td></tr>
        <tr><td>H3</td><td>clamp(1,35 → 1,7 rem)</td><td>Tarjetas y bloques</td></tr>
        <tr><td>Lead</td><td>clamp(1,08 → 1,25 rem)</td><td>Subtítulos</td></tr>
        <tr><td>Base</td><td>1 rem</td><td>Texto</td></tr>
        <tr><td>Small</td><td>0,78–0,875 rem</td><td>Metadatos y chips</td></tr>
      </tbody></table>

      <h3 class="rv-h">Botones · 7 estados</h3>
      <div class="rv-states">${btnRow('btn--primary', 'Agendar')}</div>
      <div class="rv-states">${btnRow('btn--ghost', 'Ver más', false)}</div>
      <div class="rv-states rv-states--dark">${btnRow('btn--light', 'Agendar')}</div>
      <div class="rv-demo">
        <button type="button" class="btn btn--primary" id="rv-demo-btn"><span class="btn__label">Probar secuencia</span><span class="btn__icon">${icon('arrow-right')}</span></button>
        <span>Clic: loading 1,4 s → success 1,2 s → normal.</span>
      </div>

      <h3 class="rv-h">Campos</h3>
      <div class="rv-fields">
        <div class="field"><span class="field__label">Normal</span><input class="input" tabindex="-1" placeholder="Nombre y apellido"></div>
        <div class="field"><span class="field__label">Foco</span><input class="input is-focus" tabindex="-1" value="María Pérez"></div>
        <div class="field is-invalid"><span class="field__label">Error</span><input class="input" tabindex="-1" value="809-12"><p class="field__error">${icon('alert')}<span>Revisa el número: 10 dígitos.</span></p></div>
        <div class="field is-valid"><span class="field__label">Válido</span><input class="input" tabindex="-1" value="809-555-0147"></div>
        <div class="field"><span class="field__label">Deshabilitado</span><input class="input" tabindex="-1" disabled value="Primero elige especialista"></div>
      </div>

      <h3 class="rv-h">Etiquetas</h3>
      <div class="rv-chips"><span class="chip">Chip</span><span class="chip chip--green">Chip verde</span><span class="tag">Ortopedia</span><span class="tag tag--uro">Urología</span><span class="tbc">Por confirmar</span></div>

      <h3 class="rv-h">Espaciado · base 4 px</h3>
      <ul class="rv-space">${[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((n) => `<li><span style="width:${n}px"></span><code>${n}</code></li>`).join('')}</ul>
      <p class="rv-small">Secciones: clamp(76 → 136 px) vertical. Margen lateral: clamp(16 → 40 px). Contenedor: 1240 px.</p>

      <h3 class="rv-h">Radios y sombras</h3>
      <ul class="rv-radii">${[['xs', 8], ['sm', 12], ['md', 18], ['lg', 24], ['xl', 32], ['2xl', 40], ['pill', 999]].map(([n, r]) => `<li><span style="border-radius:${Math.min(r, 28)}px"></span><code>${n} · ${r === 999 ? 'píldora' : r + 'px'}</code></li>`).join('')}</ul>
      <ul class="rv-shadows"><li style="box-shadow:var(--sh-1)">sh-1</li><li style="box-shadow:var(--sh-2)">sh-2</li><li style="box-shadow:var(--sh-3)">sh-3</li><li style="box-shadow:var(--sh-verde)">sh-verde</li></ul>

      <h3 class="rv-h">Movimiento</h3>
      <table class="rv-table"><thead><tr><th>Token</th><th>Valor</th><th>Uso</th></tr></thead><tbody>
        <tr><td>--dur-1</td><td>160 ms</td><td>Color, pequeños cambios</td></tr>
        <tr><td>--dur-2</td><td>260 ms</td><td>Hover de botones y enlaces</td></tr>
        <tr><td>--dur-3</td><td>420 ms</td><td>Modales, acordeones, paneles</td></tr>
        <tr><td>--dur-4</td><td>700 ms</td><td>Píldoras deslizantes, zoom de fotos</td></tr>
        <tr><td>--dur-5</td><td>1000 ms</td><td>Revelados y carga del hero</td></tr>
        <tr><td>--ease-out</td><td>cubic-bezier(.22,1,.36,1)</td><td>Curva principal</td></tr>
        <tr><td>--ease-spring</td><td>cubic-bezier(.34,1.36,.64,1)</td><td>Íconos y check (rebote leve)</td></tr>
      </tbody></table>
      <div class="rv-ease">
        <button type="button" class="btn btn--ghost btn--sm" id="rv-ease-play"><span class="btn__label">Reproducir curvas</span></button>
        <div class="rv-ease__track"><span data-ease="var(--ease-out)"></span><small>ease-out</small></div>
        <div class="rv-ease__track"><span data-ease="var(--ease-in-out)"></span><small>ease-in-out</small></div>
        <div class="rv-ease__track"><span data-ease="var(--ease-spring)"></span><small>spring</small></div>
      </div>
      <p class="rv-small">Solo se anima transform, opacity y filter. Con <code>prefers-reduced-motion</code> se desactivan parallax, flotación, marquee, autoplay y revelados.</p>

      <h3 class="rv-h">Puntos de corte</h3>
      <table class="rv-table"><tbody>
        <tr><td>1440</td><td>Escritorio de referencia</td></tr>
        <tr><td>≤ 1080</td><td>Menú desplegable</td></tr>
        <tr><td>≤ 980</td><td>Tablet: hero y secciones en una columna</td></tr>
        <tr><td>≤ 760</td><td>Modal como hoja inferior, sin flotación</td></tr>
        <tr><td>≤ 640</td><td>Móvil 390: una columna, botones a todo el ancho</td></tr>
      </tbody></table>`;

    const demo = $('#rv-demo-btn', pane);
    demo.addEventListener('click', () => {
      demo.classList.add('is-loading');
      $('.btn__label', demo).textContent = 'Enviando…';
      setTimeout(() => {
        demo.classList.remove('is-loading');
        demo.classList.add('is-success');
        $('.btn__label', demo).textContent = 'Listo';
        $('use', demo).setAttribute('href', '#check');
        setTimeout(() => { demo.classList.remove('is-success'); $('.btn__label', demo).textContent = 'Probar secuencia'; $('use', demo).setAttribute('href', '#arrow-right'); }, 1200);
      }, 1400);
    });
    $('#rv-ease-play', pane).addEventListener('click', () => {
      $$('.rv-ease__track span', pane).forEach((s) => {
        s.style.transition = 'none';
        s.style.transform = 'translateX(0)';
        void s.offsetWidth;
        s.style.transition = `transform 1000ms ${s.dataset.ease}`;
        s.style.transform = 'translateX(calc(var(--track) - 16px))';
      });
    });
  };

  /* --------------------------- Panel lateral ------------------------------ */
  const tabs = $$('.rv-tabs [role="tab"]', drawer);
  const selectTab = (name) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    $$('.rv-pane', drawer).forEach((p) => { p.hidden = p.dataset.pane !== name; });
    if (name === 'pend') renderPending();
    if (name === 'sys' && !$('[data-pane="sys"]', drawer).children.length) renderSystem();
    $('.rv-drawer__body', drawer).scrollTop = 0;
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t.dataset.tab));
    t.addEventListener('keydown', (e) => {
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1 };
      if (!(e.key in map)) return;
      const n = tabs[(map[e.key] + tabs.length) % tabs.length];
      selectTab(n.dataset.tab); n.focus();
    });
  });
  const renderAnnotList = () => {
    $('[data-pane="annot"]', drawer).innerHTML = `
      <p class="rv-lead">Cada número aparece sobre la página cuando activas las anotaciones. Todo el movimiento usa transform y opacity y respeta «reducir movimiento».</p>
      <ol class="rv-annots">${targets.map((a) => `<li><button type="button" data-annot-go="${a.n - 1}"><b>${a.n}</b><span><strong>${esc(a.t)}</strong>${esc(a.a)}</span></button></li>`).join('')}</ol>`;
  };
  $('[data-pane="annot"]', drawer).addEventListener('click', (e) => {
    const b = e.target.closest('[data-annot-go]');
    if (!b) return;
    closeDrawer();
    focusAnnotation(targets[Number(b.dataset.annotGo)]);
  });
  const openDrawer = (tab) => {
    setMenu(false);
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    selectTab(tab);
    $('.rv-drawer__close', drawer).focus({ preventScroll: true });
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    setTimeout(() => { drawer.hidden = true; }, 320);
  };
  $('.rv-drawer__close', drawer).addEventListener('click', closeDrawer);
  drawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); toggle.focus(); } });

  /* --------------------------- Acciones del menú -------------------------- */
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rv]');
    if (!b) return;
    const k = b.dataset.rv;
    if (k === 'annot') { setPins(!pinsOn); if (pinsOn) setMenu(false); }
    if (k === 'pend') openDrawer('pend');
    if (k === 'sys') openDrawer('sys');
    if (k === 'mark') {
      const on = !d.body.classList.contains('rv-mark');
      d.body.classList.toggle('rv-mark', on);
      b.setAttribute('aria-pressed', String(on));
    }
  });

  renderAnnotList();
  renderPending();
})();

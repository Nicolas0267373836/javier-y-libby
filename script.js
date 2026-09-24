/* ==========================================================================
   Abud & Martínez — interacciones del prototipo
   Cada módulo se inicializa por separado (safe): si uno falla, los demás siguen.
   ========================================================================== */
(() => {
  'use strict';

  const d = document;
  const w = window;
  const root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const mqReduce = w.matchMedia('(prefers-reduced-motion: reduce)');
  const mqMobile = w.matchMedia('(max-width: 767px)');
  const mqHover = w.matchMedia('(hover: hover)');
  const mqDeskNav = w.matchMedia('(min-width: 1081px)');
  const reduced = () => mqReduce.matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const EASE = 'cubic-bezier(.22, 1, .36, 1)';
  const icon = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safe = (name, fn) => { try { return fn(); } catch (err) { console.error(`[Abud & Martínez] Error en ${name}:`, err); return undefined; } };

  /* ------------------------------------------------------------------------
     DATOS EDITABLES
     Todo lo que no está confirmado por la clínica aparece como «por confirmar».
     ------------------------------------------------------------------------ */
  const DOCTORES = {
    abud: {
      nombre: 'Dr. Alejandro Abud', completo: 'Dr. Alejandro J. Abud Gómez', rol: 'Cirujano ortopeda',
      foto: 'images/dr-alejandro-abud.jpg', articulo: 'el',
      sedes: [
        { lugar: 'Bávaro · Innovacare', detalle: 'Lunes, miércoles y viernes · con cita' },
        { lugar: 'San Pedro · Centro Hospitalario UCE', detalle: 'Martes y jueves · 8:30 a. m. – 3:00 p. m.' }
      ]
    },
    libby: {
      nombre: 'Dra. Libby Martínez', completo: 'Dra. Libby E. Martínez de Abud', rol: 'Cirujana uróloga',
      foto: 'images/dra-libby-martinez.jpg', articulo: 'la',
      sedes: [
        { lugar: 'Bávaro · Innovacare', detalle: 'Lunes, miércoles y viernes · con cita' },
        { lugar: 'San Pedro · Centro Hospitalario UCE', detalle: 'Martes y jueves · 8:30 a. m. – 3:00 p. m.' }
      ]
    }
  };

  const SEDES = {
    bavaro: { nombre: 'Bávaro · Innovacare', corto: 'Bávaro', tel: '849-449-7353' },
    spm: { nombre: 'San Pedro de Macorís', corto: 'San Pedro de Macorís', tel: '829-515-0011' }
  };

  /* Días de consulta (1 = lunes … 5 = viernes). null = por confirmar: se permiten días laborables. */
  const HORARIOS = {
    libby: { bavaro: [1, 3, 5], spm: [2, 4] },
    abud: { bavaro: [1, 3, 5], spm: [2, 4] }
  };

  /* Proceso publicado en doctorabud.com (preparación, diagnóstico, consulta). */
  const PROCESO = [
    ['Preparación', 'Reúne estudios previos, tu seguro y tus dudas.'],
    ['Diagnóstico', 'Examen físico y, si hace falta, estudios de imagen.'],
    ['Plan', 'Resultados y opciones de tratamiento explicadas.']
  ];

  /* Tratamientos: generan tarjetas, modal, opciones del formulario, pie de página y contador.
     Fuentes: gráficos de Instagram entregados, bordado de la bata y doctorabud.com. Validar con cada especialista. */
  const TRATAMIENTOS = [
    {
      id: 'artroscopia', cat: 'ortopedia', doctor: 'abud', icon: 'i-rodilla', imagen: 'images/tratamiento-artroscopia.jpg',
      titulo: 'Artroscopia de rodilla y hombro', corto: 'Artroscopia',
      resumen: 'Diagnóstico y tratamiento de lesiones articulares a través de incisiones pequeñas.',
      que: 'La artroscopia permite ver el interior de la articulación con una cámara delgada y tratar la lesión con instrumentos de pocos milímetros. Es una técnica mínimamente invasiva que el Dr. Abud utiliza en rodilla y hombro.',
      cuando: ['Dolor persistente en la rodilla o el hombro', 'Inflamación o hinchazón de la articulación', 'Movimiento limitado o sensación de bloqueo', 'Debilidad o inestabilidad después de una lesión'],
      incluye: ['Rodilla', 'Hombro', 'Técnica mínimamente invasiva']
    },
    {
      id: 'columna', cat: 'ortopedia', doctor: 'abud', icon: 'i-columna', imagen: 'images/tratamiento-columna.jpg',
      titulo: 'Cirugía endoscópica de columna lumbar', corto: 'Endoscopia de columna',
      resumen: 'Técnica mínimamente invasiva para tratar problemas de la columna lumbar.',
      que: 'La endoscopia de columna es una técnica quirúrgica mínimamente invasiva que permite diagnosticar y tratar problemas de la columna vertebral a través de una incisión pequeña. Busca una intervención precisa y, según cada caso, una recuperación más rápida que la cirugía tradicional.',
      cuando: ['Dolor lumbar crónico que no mejora con tratamiento conservador', 'Hernia de disco que comprime un nervio', 'Estrechamiento del canal espinal (estenosis)', 'Ciática: dolor que baja por la pierna'],
      incluye: ['Descompresión endoscópica', 'Extracción de hernia discal', 'Tratamiento de estenosis espinal']
    },
    {
      id: 'terapia-celular', cat: 'ortopedia', doctor: 'abud', icon: 'i-celulas', imagen: 'images/tratamiento-terapia-celular.jpg',
      titulo: 'Terapia celular y medicina regenerativa', corto: 'Terapia celular',
      resumen: 'Plasma rico en plaquetas, exosomas y células madre para lesiones musculoesqueléticas.',
      que: 'La terapia celular es un área de la medicina regenerativa que utiliza componentes biológicos para apoyar la reparación de tejidos en algunas condiciones musculoesqueléticas. Su indicación se define de forma individual, después de la evaluación.',
      cuando: ['Dolor crónico que no responde al tratamiento convencional', 'Desgaste del cartílago (artrosis)', 'Lesiones de ligamentos, tendones o músculos', 'Inflamación articular persistente'],
      incluye: ['Plasma rico en plaquetas (PRP)', 'Exosomas', 'Células madre', 'Factores de crecimiento']
    },
    {
      id: 'reemplazo-articular', cat: 'ortopedia', doctor: 'abud', icon: 'i-reemplazo', imagen: 'images/tratamiento-reemplazo-articular.jpg',
      titulo: 'Reemplazo articular', corto: 'Reemplazo articular',
      resumen: 'Sustitución de una articulación dañada para aliviar el dolor y recuperar movilidad.',
      que: 'El reemplazo articular es un procedimiento quirúrgico que sustituye una articulación dañada por una prótesis. Se considera cuando el dolor y la limitación son importantes y otros tratamientos no han sido suficientes.',
      cuando: ['Dolor articular intenso que no mejora con otros tratamientos', 'Rigidez y movilidad limitada', 'Inflamación crónica de la articulación', 'Deformidad por artritis avanzada'],
      incluye: null, incluyeTbc: 'Articulaciones que trata: por confirmar'
    },
    {
      id: 'traumatologia', cat: 'ortopedia', doctor: 'abud', icon: 'i-hueso', imagen: 'images/tratamiento-traumatologia.jpg',
      titulo: 'Ortopedia y traumatología', corto: 'Traumatología',
      resumen: 'Lesiones de huesos, músculos, ligamentos, articulaciones y tendones.',
      que: 'La ortopedia y traumatología se ocupa del diagnóstico, el tratamiento y la prevención de lesiones y afecciones del sistema musculoesquelético, con el objetivo de aliviar el dolor y mejorar la movilidad.',
      cuando: ['Fracturas o golpes con dolor persistente', 'Lesiones de ligamentos o tendones', 'Dolor o lesiones de mano y muñeca', 'Lesiones deportivas'],
      incluye: ['Cirugía de fracturas', 'Reparación de ligamentos y tendones', 'Cirugía de mano y muñeca']
    },
    {
      id: 'ortopedia-infantil', cat: 'ortopedia', doctor: 'abud', icon: 'i-pie', imagen: 'images/tratamiento-ortopedia-infantil.jpg',
      titulo: 'Ortopedia infantil', corto: 'Ortopedia infantil',
      resumen: 'Problemas musculoesqueléticos en niños y adolescentes, cuidando su crecimiento.',
      que: 'La ortopedia infantil se especializa en el diagnóstico, el tratamiento y la prevención de problemas musculoesqueléticos en niños y adolescentes, con atención al crecimiento y al desarrollo del esqueleto.',
      cuando: ['Pie plano', 'Displasia o luxación de cadera', 'Escoliosis', 'Lesiones deportivas'],
      incluye: ['Ortesis', 'Cirugía correctiva']
    },
    {
      id: 'urologia-femenina', cat: 'urologia', doctor: 'libby', icon: 'i-femenina', imagen: 'images/tratamiento-urologia-femenina.jpg',
      titulo: 'Urología femenina', corto: 'Urología femenina',
      resumen: 'Evaluación y tratamiento de condiciones urinarias en la mujer.',
      que: 'La urología femenina atiende condiciones del tracto urinario en la mujer. Es una de las áreas que destaca la Dra. Libby Martínez, con un enfoque de escucha y acompañamiento.',
      cuando: ['Infecciones urinarias frecuentes', 'Pérdidas de orina o urgencia para orinar', 'Molestias o ardor al orinar', 'Sangre en la orina'],
      incluye: null, incluyeTbc: 'Procedimientos específicos por confirmar'
    },
    {
      id: 'prostata', cat: 'urologia', doctor: 'libby', icon: 'i-prostata', imagen: 'images/tratamiento-prostata.jpg',
      titulo: 'Próstata', corto: 'Próstata',
      resumen: 'Salud prostática y cirugía mínimamente invasiva de próstata.',
      que: 'La consulta de próstata incluye la evaluación, el seguimiento y, cuando es necesario, el tratamiento quirúrgico. La Dra. Libby Martínez realiza cirugías mínimamente invasivas de próstata.',
      cuando: ['Chorro débil o dificultad para orinar', 'Necesidad de orinar con frecuencia, sobre todo de noche', 'Sensación de no vaciar la vejiga', 'Chequeo prostático preventivo'],
      incluye: ['Evaluación prostática', 'Cirugía mínimamente invasiva de próstata']
    },
    {
      id: 'rinones', cat: 'urologia', doctor: 'libby', icon: 'i-rinon', imagen: 'images/tratamiento-rinones.jpg',
      titulo: 'Riñones', corto: 'Riñones',
      resumen: 'Salud renal y cirugía mínimamente invasiva de riñón.',
      que: 'La urología trata los problemas quirúrgicos del riñón y de las vías urinarias. La Dra. Libby Martínez realiza cirugías mínimamente invasivas de riñón y promueve el cuidado de la salud renal.',
      cuando: ['Dolor en el costado o la espalda baja', 'Sangre en la orina', 'Hallazgos en estudios de imagen del riñón', 'Seguimiento de una condición renal'],
      incluye: ['Cirugía mínimamente invasiva de riñón', 'Salud renal']
    },
    {
      id: 'calculos', cat: 'urologia', doctor: 'libby', icon: 'i-calculos', imagen: 'images/tratamiento-calculos-urinarios.jpg',
      titulo: 'Cálculos de vías urinarias', corto: 'Cálculos urinarios',
      resumen: 'Diagnóstico y tratamiento de piedras en el riñón y las vías urinarias.',
      que: 'Los cálculos (piedras) se forman en el riñón y pueden desplazarse por las vías urinarias, causando dolor intenso u obstrucción. El tratamiento depende de su tamaño y ubicación, y puede incluir opciones mínimamente invasivas.',
      cuando: ['Dolor intenso en el costado que puede irradiarse', 'Sangre en la orina', 'Náuseas o vómitos junto al dolor', 'Antecedentes de cálculos'],
      incluye: ['Cirugía mínimamente invasiva de cálculos']
    },
    {
      id: 'chequeo-urologico', cat: 'urologia', doctor: 'libby', icon: 'i-chequeo', imagen: 'images/tratamiento-chequeo-urologico.png',
      titulo: 'Urología general y chequeos preventivos', corto: 'Chequeos preventivos',
      resumen: 'Chequeos urológicos y prevención para hombres y mujeres.',
      que: 'La consulta de urología general evalúa la salud del sistema urinario y, en los hombres, del aparato reproductor. Los chequeos periódicos ayudan a detectar a tiempo problemas urinarios, renales y prostáticos.',
      cuando: ['Chequeo urológico preventivo', 'Molestias al orinar', 'Infecciones urinarias', 'Seguimiento de una condición urológica'],
      incluye: ['Consulta de urología general', 'Chequeo preventivo']
    }
  ];

  const CAT_LABEL = { ortopedia: 'Ortopedia', urologia: 'Urología' };
  const fmtNum = new Intl.NumberFormat('es-DO');
  const fmtFecha = new Intl.DateTimeFormat('es-DO', { weekday: 'long', day: 'numeric', month: 'long' });
  const DIAS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
  const DIAS_LARGO = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const parseISO = (s) => { const [y, m, dd] = s.split('-').map(Number); return new Date(y, m - 1, dd); };
  const toISO = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
  const fechaLarga = (iso) => (iso ? fmtFecha.format(parseISO(iso)) : '');

  /* ------------------------------------------------------------------------
     Utilidades de scroll y bloqueo
     ------------------------------------------------------------------------ */
  const scrollFns = [];
  const resizeFns = [];
  let scrollQueued = false;
  const onScroll = (fn) => scrollFns.push(fn);
  const onResize = (fn) => resizeFns.push(fn);
  w.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { scrollQueued = false; scrollFns.forEach((fn) => safe('scroll', fn)); });
  }, { passive: true });
  let resizeTimer;
  w.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeFns.forEach((fn) => safe('resize', fn)); scrollFns.forEach((fn) => safe('scroll', fn)); }, 120);
  });

  let locks = 0;
  const lockScroll = (on) => {
    locks = Math.max(0, locks + (on ? 1 : -1));
    const lock = locks > 0;
    if (lock && !root.classList.contains('is-locked')) {
      const sb = w.innerWidth - root.clientWidth;
      if (sb > 0) root.style.paddingRight = `${sb}px`;
    }
    if (!lock) root.style.paddingRight = '';
    root.classList.toggle('is-locked', lock);
  };

  const focusables = (el) => $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])', el)
    .filter((x) => x.offsetParent !== null || x === d.activeElement);
  const trapTab = (e, el) => {
    if (e.key !== 'Tab') return;
    const f = focusables(el);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ------------------------------------------------------------------------
     1. Revelado al hacer scroll (se "arma" justo antes de entrar en pantalla)
     ------------------------------------------------------------------------ */
  let armObserver = null;
  let showObserver = null;
  const Reveal = {
    init() {
      if (!('IntersectionObserver' in w)) return;
      showObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          showObserver.unobserve(e.target);
          requestAnimationFrame(() => e.target.classList.add('is-in'));
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
      armObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          armObserver.unobserve(e.target);
          if (reduced()) return;
          if (e.boundingClientRect.top > w.innerHeight * 0.94) {
            e.target.classList.add('is-armed');
            showObserver.observe(e.target);
          }
        });
      }, { rootMargin: '0px 0px 65% 0px', threshold: 0 });
      Reveal.observe($$('.reveal'));
    },
    observe(els) { if (armObserver) els.forEach((el) => armObserver.observe(el)); }
  };

  /* ------------------------------------------------------------------------
     2. Contadores (animan desde cero solo al entrar en pantalla)
     ------------------------------------------------------------------------ */
  function initCounters() {
    const els = $$('.count[data-count]');
    els.forEach((el) => {
      if (el.dataset.countSource === 'tratamientos') el.dataset.count = String(TRATAMIENTOS.length);
      el.textContent = fmtNum.format(Number(el.dataset.count) || 0);
    });
    if (reduced() || !('IntersectionObserver' in w)) return;
    const run = (el) => {
      const target = Number(el.dataset.count) || 0;
      const t0 = performance.now();
      const dur = 1400;
      el.classList.add('is-counting');
      const tick = (now) => {
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = fmtNum.format(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
        else el.classList.remove('is-armed');
      };
      requestAnimationFrame(tick);
    };
    const runIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runIO.unobserve(e.target); run(e.target); } });
    }, { threshold: 0.6 });
    const armIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        armIO.unobserve(e.target);
        if (e.boundingClientRect.top > w.innerHeight * 0.9) {
          e.target.textContent = '0';
          e.target.classList.add('is-armed');
          runIO.observe(e.target);
        }
      });
    }, { rootMargin: '0px 0px 60% 0px' });
    els.forEach((el) => armIO.observe(el));
  }

  /* ------------------------------------------------------------------------
     3. Imágenes: de desenfocado a nítido al cargar (lazy)
     ------------------------------------------------------------------------ */
  function initImages() {
    $$('.media img').forEach((img) => {
      if (img.closest('.load-img')) return;
      if (img.complete && img.naturalWidth) return;
      img.classList.add('is-pending');
      const done = () => { img.classList.remove('is-pending'); img.classList.add('is-ready'); };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', () => img.classList.remove('is-pending'), { once: true });
    });
  }

  /* ------------------------------------------------------------------------
     4. Navegación: sticky, píldora deslizante, scrollspy y menú móvil
     ------------------------------------------------------------------------ */
  function initNav() {
    const nav = $('#nav');
    const burger = $('#burger');
    const menu = $('#menu');
    const list = $('#nav-links');
    if (!nav || !burger || !menu || !list) return;
    const links = $$('a[data-spy]', list);
    const pill = $('.nav__pill', list);
    let active = null;

    onScroll(() => nav.classList.toggle('is-scrolled', w.scrollY > 8));

    const movePill = (a) => {
      if (!pill) return;
      if (!a || !mqDeskNav.matches) { pill.style.setProperty('--o', '0'); return; }
      pill.style.setProperty('--x', `${a.offsetLeft}px`);
      pill.style.setProperty('--w', `${a.offsetWidth}px`);
      pill.style.setProperty('--o', '1');
    };
    links.forEach((a) => {
      a.addEventListener('mouseenter', () => movePill(a));
      a.addEventListener('focus', () => movePill(a));
    });
    list.addEventListener('mouseleave', () => movePill(active));
    list.addEventListener('focusout', () => setTimeout(() => { if (!list.contains(d.activeElement)) movePill(active); }, 0));

    /* Secciones sin enlace propio se asignan al más cercano */
    const SPY = { inicio: 'inicio', nosotros: 'nosotros', especialistas: 'nosotros', tratamientos: 'tratamientos', 'por-que': 'tratamientos', tecnologia: 'tecnologia', galeria: 'tecnologia', testimonios: 'testimonios', preguntas: null, agendar: null, contacto: 'contacto' };
    const sections = Object.keys(SPY).map((id) => d.getElementById(id)).filter(Boolean);
    const spy = () => {
      const line = w.innerHeight * 0.36;
      let current = sections[0];
      sections.forEach((s) => { if (s.getBoundingClientRect().top <= line) current = s; });
      if (w.innerHeight + w.scrollY >= root.scrollHeight - 4) current = d.getElementById('contacto') || current;
      const key = SPY[current.id];
      const a = key ? links.find((l) => l.dataset.spy === key) : null;
      if (a === active) return;
      active = a;
      links.forEach((l) => {
        const on = l === a;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
      });
      if (!list.matches(':hover')) movePill(active);
    };
    onScroll(spy);
    onResize(() => movePill(active));
    spy();
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => movePill(active));

    /* Menú móvil */
    const scrim = d.createElement('div');
    scrim.className = 'nav-scrim';
    d.body.appendChild(scrim);
    const setOpen = (open) => {
      if (open === nav.classList.contains('is-open')) return;
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      scrim.classList.toggle('is-visible', open);
      lockScroll(open);
      if (open) setTimeout(() => links[0] && links[0].focus({ preventScroll: true }), 60);
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    scrim.addEventListener('click', () => setOpen(false));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    nav.addEventListener('keydown', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setOpen(false); burger.focus(); }
      if (e.key === 'Tab' && !mqDeskNav.matches) trapTab(e, nav);
    });
    mqDeskNav.addEventListener('change', () => { setOpen(false); movePill(active); });
  }

  /* ------------------------------------------------------------------------
     5. Parallax suave del hero y sección oscura que se expande
     ------------------------------------------------------------------------ */
  function initParallax() {
    const els = $$('[data-parallax]');
    const hero = $('.hero');
    if (!els.length || !hero) return;
    const update = () => {
      const enabled = !reduced() && w.innerWidth >= 900;
      const y = w.scrollY;
      if (!enabled || y > hero.offsetTop + hero.offsetHeight) {
        if (!enabled) els.forEach((el) => { el.style.transform = ''; });
        return;
      }
      els.forEach((el) => {
        const f = Number(el.dataset.parallax) || 0;
        el.style.transform = `translate3d(0, ${(y * f).toFixed(1)}px, 0)`;
      });
    };
    onScroll(update);
    update();
  }

  function initTechFrame() {
    const sec = $('.tech');
    const frame = sec && $('.tech__frame', sec);
    if (!frame) return;
    const update = () => {
      if (reduced() || w.innerWidth < 768) { frame.style.setProperty('--p', '1'); return; }
      const r = sec.getBoundingClientRect();
      const vh = w.innerHeight;
      frame.style.setProperty('--p', clamp((vh - r.top) / (vh * 0.72), 0, 1).toFixed(3));
    };
    onScroll(update);
    update();
  }

  /* ------------------------------------------------------------------------
     6. Tratamientos: tarjetas, filtros con FLIP y modal de detalle
     ------------------------------------------------------------------------ */
  const Modal = (() => {
    const el = $('#t-modal');
    if (!el) return { open() {}, close() {}, isOpen: () => false };
    const panel = $('.modal__panel', el);
    const body = $('#tm-body');
    const count = $('#tm-count');
    let current = -1;
    let trigger = null;
    let timer = null;

    const render = (i, swap) => {
      const t = TRATAMIENTOS[i];
      const doc = DOCTORES[t.doctor];
      const uro = t.cat === 'urologia';
      const incluye = t.incluye
        ? `<ul class="chips">${t.incluye.map((x) => `<li class="chip chip--green">${esc(x)}</li>`).join('')}</ul>`
        : `<p><span class="tbc tbc--block">${esc(t.incluyeTbc || 'Por confirmar')}</span></p>`;
      body.innerHTML = `
        <article class="tm${swap ? ' is-swapping' : ''}">
          <aside class="tm__side">
            <div class="tm__art${uro ? ' is-uro' : ''}">
              <img class="tm__image" src="${t.imagen}" alt="" width="1600" height="900" loading="lazy" decoding="async">
              <span class="tag${uro ? ' tag--uro' : ''}">${CAT_LABEL[t.cat]}</span>
            </div>
            <div class="tm__doc">
              <img src="${doc.foto}" alt="" width="864" height="1080">
              <span><strong>${esc(doc.nombre)}</strong><span>${esc(doc.rol)}</span></span>
            </div>
            <ul class="tm__places">
              ${doc.sedes.map((s) => `<li>${icon('map-pin')}<span><strong>${esc(s.lugar)}</strong><br>${s.tbc ? `<span class="tbc">${esc(s.detalle)}</span>` : esc(s.detalle)}</span></li>`).join('')}
            </ul>
          </aside>
          <div class="tm__main">
            <p class="tm__eyebrow">${CAT_LABEL[t.cat]} · ${esc(doc.nombre)}</p>
            <h2 id="tm-title">${esc(t.titulo)}</h2>
            <p class="tm__lead">${esc(t.resumen)}</p>
            <section class="tm__sec"><h3>¿En qué consiste?</h3><p>${esc(t.que)}</p></section>
            <section class="tm__sec"><h3>¿Cuándo consultar?</h3><ul class="checklist">${t.cuando.map((c) => `<li>${icon('check')}<span>${esc(c)}</span></li>`).join('')}</ul></section>
            <section class="tm__sec"><h3>Incluye</h3>${incluye}</section>
            <section class="tm__sec"><h3>Cómo es el proceso</h3><ol class="steps-mini">${PROCESO.map((p, k) => `<li><b><i>0${k + 1}</i>${esc(p[0])}</b>${esc(p[1])}</li>`).join('')}</ol></section>
            <p class="tm__note">${icon('info')}<span>Información general con fines educativos; no sustituye la evaluación médica. Texto pendiente de validación por el especialista.</span></p>
            <div class="tm__actions">
              <button class="btn btn--primary" type="button" data-book-treatment><span class="btn__label">Agendar para este tratamiento</span><span class="btn__icon">${icon('arrow-right')}</span></button>
              <button class="btn btn--ghost" type="button" data-wa-open><span class="btn__label">Preguntar por WhatsApp</span></button>
            </div>
          </div>
        </article>`;
      count.textContent = `${i + 1} de ${TRATAMIENTOS.length}`;
      $('.modal__scroll', el).scrollTop = 0;
    };

    const open = (id, from) => {
      const i = TRATAMIENTOS.findIndex((t) => t.id === id);
      if (i < 0) return;
      clearTimeout(timer);
      trigger = from || d.activeElement;
      current = i;
      render(i, false);
      const wasHidden = el.hidden;
      el.hidden = false;
      if (wasHidden) lockScroll(true);
      if (from && from.getBoundingClientRect && !mqMobile.matches) {
        const r = from.getBoundingClientRect();
        const p = panel.getBoundingClientRect();
        panel.style.transformOrigin = `${Math.round(r.left + r.width / 2 - p.left)}px ${Math.round(r.top + r.height / 2 - p.top)}px`;
      } else {
        panel.style.transformOrigin = '';
      }
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
      setTimeout(() => $('.modal__close', el).focus({ preventScroll: true }), 30);
      try { history.replaceState(null, '', `#tratamiento-${id}`); } catch (err) { /* sin historial en algunos marcos */ }
    };

    const close = (restore = true) => {
      if (el.hidden) return;
      el.classList.remove('is-open');
      clearTimeout(timer);
      timer = setTimeout(() => { el.hidden = true; lockScroll(false); }, reduced() ? 0 : 380);
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { /* ignorar */ }
      if (restore && trigger && trigger.focus && d.contains(trigger)) trigger.focus({ preventScroll: true });
    };

    const step = (dir) => {
      current = (current + dir + TRATAMIENTOS.length) % TRATAMIENTOS.length;
      render(current, !reduced());
      try { history.replaceState(null, '', `#tratamiento-${TRATAMIENTOS[current].id}`); } catch (err) { /* ignorar */ }
    };

    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { close(); return; }
      const nav = e.target.closest('[data-tm]');
      if (nav) { step(nav.dataset.tm === 'next' ? 1 : -1); return; }
      if (e.target.closest('[data-book-treatment]')) {
        const t = TRATAMIENTOS[current];
        close(false);
        Booking.prefill(t.doctor, t.id);
      }
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest('input, select, textarea')) {
        step(e.key === 'ArrowRight' ? 1 : -1);
        return;
      }
      trapTab(e, panel);
    });

    return { open, close, isOpen: () => !el.hidden, get index() { return current; } };
  })();

  function initTreatments() {
    const grid = $('#t-grid');
    const cta = $('#t-cta');
    if (!grid) return;
    const cardHTML = (t, i) => {
      const doc = DOCTORES[t.doctor];
      return `<a class="t-card reveal" style="--i:${i % 3}" href="#tratamiento-${t.id}" data-id="${t.id}" data-cat="${t.cat}" aria-haspopup="dialog">
        <div class="t-card__art">
          <img class="t-card__image" src="${t.imagen}" alt="" width="1600" height="900" loading="lazy" decoding="async">
          <span class="tag t-card__tag${t.cat === 'urologia' ? ' tag--uro' : ''}">${CAT_LABEL[t.cat]}</span>
        </div>
        <div class="t-card__body">
          <h3 class="t-card__title">${esc(t.titulo)}</h3>
          <p class="t-card__text">${esc(t.resumen)}</p>
        </div>
        <div class="t-card__foot">
          <span class="t-card__doc"><img src="${doc.foto}" alt="" width="864" height="1080" loading="lazy">${esc(doc.nombre)}</span>
          <span class="t-card__more"><span class="sr-only">Ver detalle</span><span class="arrow-circle">${icon('arrow-right')}</span></span>
        </div>
      </a>`;
    };
    grid.insertAdjacentHTML('afterbegin', TRATAMIENTOS.map(cardHTML).join(''));
    const cards = $$('.t-card:not(.t-card--cta)', grid);
    Reveal.observe(cards);

    /* Contadores de filtros */
    const counts = { todos: TRATAMIENTOS.length, ortopedia: 0, urologia: 0 };
    TRATAMIENTOS.forEach((t) => { counts[t.cat] += 1; });
    $$('[data-count-of]').forEach((s) => { s.textContent = counts[s.dataset.countOf]; });

    /* Tarjeta de orientación: aparece solo si completa la última fila */
    const columns = () => getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
    const syncCta = () => {
      if (!cta) return;
      const n = cards.filter((c) => !c.hidden).length;
      const c = columns();
      cta.hidden = n % c !== c - 1;
    };
    syncCta();
    onResize(syncCta);

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.t-card[data-id]');
      if (!card) return;
      e.preventDefault();
      Modal.open(card.dataset.id, card);
    });

    /* Filtros con píldora deslizante */
    const wrap = $('.filter');
    const btns = $$('.filter__btn', wrap);
    const pill = $('.filter__pill', wrap);
    const place = (b) => {
      if (!pill || !b) return;
      pill.style.setProperty('--x', `${b.offsetLeft}px`);
      pill.style.setProperty('--w', `${b.offsetWidth}px`);
      pill.style.top = `${b.offsetTop}px`;
      pill.style.height = `${b.offsetHeight}px`;
      pill.style.bottom = 'auto';
    };
    const apply = (f) => {
      const match = (c) => f === 'todos' || c.dataset.cat === f;
      const leaving = cards.filter((c) => !c.hidden && !match(c));
      const doApply = () => {
        const visible = cards.concat(cta ? [cta] : []).filter((c) => !c.hidden);
        const first = new Map(visible.map((c) => [c, c.getBoundingClientRect()]));
        cards.forEach((c) => {
          c.hidden = !match(c);
          c.classList.remove('reveal', 'is-armed');
          c.classList.add('is-in');
        });
        syncCta();
        if (reduced()) return;
        let k = 0;
        cards.concat(cta ? [cta] : []).forEach((c) => {
          if (c.hidden) return;
          const r = c.getBoundingClientRect();
          const f0 = first.get(c);
          if (f0) {
            const dx = f0.left - r.left;
            const dy = f0.top - r.top;
            if (Math.abs(dx) + Math.abs(dy) > 1) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 560, easing: EASE });
          } else {
            c.animate([{ opacity: 0, transform: 'translateY(20px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: (k += 1) * 55, easing: EASE, fill: 'backwards' });
          }
        });
      };
      if (!reduced() && leaving.length && Element.prototype.animate) {
        Promise.all(leaving.map((c) => c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 170, easing: 'ease-in', fill: 'forwards' }).finished))
          .then(() => { doApply(); leaving.forEach((c) => c.getAnimations().forEach((a) => a.cancel())); });
      } else {
        doApply();
      }
    };
    btns.forEach((b) => {
      b.addEventListener('click', () => {
        if (b.classList.contains('is-active')) return;
        btns.forEach((x) => { const on = x === b; x.classList.toggle('is-active', on); x.setAttribute('aria-pressed', String(on)); });
        place(b);
        apply(b.dataset.filter);
      });
    });
    const initial = btns.find((b) => b.classList.contains('is-active'));
    place(initial);
    onResize(() => place(btns.find((b) => b.classList.contains('is-active'))));
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => place(btns.find((b) => b.classList.contains('is-active'))));

    /* Enlaces de tratamientos en el pie */
    const foot = $('#footer-treatments');
    if (foot) {
      const pick = ['artroscopia', 'columna', 'terapia-celular', 'urologia-femenina', 'prostata', 'calculos'];
      foot.innerHTML = pick.map((id) => TRATAMIENTOS.find((t) => t.id === id)).filter(Boolean)
        .map((t) => `<li><a href="#tratamiento-${t.id}">${esc(t.corto)}</a></li>`).join('')
        + `<li><a href="#tratamientos">Ver los ${TRATAMIENTOS.length} tratamientos</a></li>`;
    }

    /* Enlace directo: #tratamiento-id */
    const fromHash = () => {
      const m = /^#tratamiento-([\w-]+)$/.exec(location.hash);
      if (m && !Modal.isOpen()) Modal.open(m[1], null);
    };
    w.addEventListener('hashchange', fromHash);
    fromHash();
  }

  /* ------------------------------------------------------------------------
     7. Pestañas de especialistas
     ------------------------------------------------------------------------ */
  function initDoctorTabs() {
    const tabs = $$('.doctors__tab');
    const pill = $('.doctors__pill');
    if (!tabs.length) return;
    const place = (t) => {
      if (!pill || !t) return;
      pill.style.setProperty('--x', `${t.offsetLeft}px`);
      pill.style.setProperty('--w', `${t.offsetWidth}px`);
    };
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = d.getElementById(x.getAttribute('aria-controls'));
        if (!p) return;
        if (on && !p.classList.contains('is-active')) {
          p.hidden = false;
          p.classList.add('is-active');
          if (!reduced()) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
          initImages();
        } else if (!on) {
          p.hidden = true;
          p.classList.remove('is-active', 'is-entering');
        }
      });
      place(t);
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
      });
    });
    const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
    tabs.forEach((t) => { if (t !== current) { const p = d.getElementById(t.getAttribute('aria-controls')); if (p) { p.hidden = true; p.classList.remove('is-active'); } } });
    place(current);
    onResize(() => place(tabs.find((t) => t.getAttribute('aria-selected') === 'true')));
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => place(tabs.find((t) => t.getAttribute('aria-selected') === 'true')));

    $$('[data-book-doctor]').forEach((b) => b.addEventListener('click', () => Booking.prefill(b.dataset.bookDoctor, '')));
  }

  /* ------------------------------------------------------------------------
     8. Tecnología: pestañas verticales + ilustración que se dibuja
     ------------------------------------------------------------------------ */
  const ART = {
    'i-rodilla': [{ a: [24, 7], l: [292, 44] }, { a: [24, 41], l: [292, 262] }, { a: [8.5, 38.2], l: [18, 282] }],
    'i-columna': [{ a: [31, 7.1], l: [292, 40] }, { a: [24.5, 22.4], l: [18, 130] }, { a: [41.5, 24.8], l: [292, 222] }],
    'i-celulas': [{ a: [17, 31], l: [18, 222] }, { a: [30.4, 24], l: [292, 110] }, { a: [29.5, 36], l: [292, 250] }],
    'i-calculos': [{ a: [9.4, 17], l: [18, 60] }, { a: [26.4, 36], l: [292, 262] }, { a: [37.2, 23.6], l: [292, 118] }]
  };
  function buildArt(panel) {
    const id = panel.dataset.art;
    const sym = d.getElementById(id);
    if (!sym || $('.tech-art', panel)) return;
    const labels = (panel.dataset.labels || '').split('|');
    const S = 5.3;
    const size = 48 * S;
    const tx = 200 - size / 2;
    const ty = 160 - size / 2;
    let grid = '';
    for (let x = 20; x < 400; x += 40) grid += `<line x1="${x}" y1="0" x2="${x}" y2="320"/>`;
    for (let y = 20; y < 320; y += 40) grid += `<line x1="0" y1="${y}" x2="400" y2="${y}"/>`;
    const shapes = Array.from(sym.children).map((node, k) => {
      const c = node.cloneNode(true);
      c.removeAttribute('vector-effect');
      c.setAttribute('pathLength', '1');
      c.setAttribute('style', `--k:${k}`);
      return c.outerHTML;
    }).join('');
    const callouts = (ART[id] || []).map((pt, k) => {
      const ax = tx + pt.a[0] * S;
      const ay = ty + pt.a[1] * S;
      const text = labels[k] || '';
      const wBox = Math.round(text.length * 7.6 + 26);
      const right = pt.l[0] > 200;
      const bx = right ? Math.min(pt.l[0], 400 - wBox - 10) : pt.l[0];
      const by = pt.l[1] - 15;
      const ex = right ? bx : bx + wBox;
      return `<g class="callout" style="--k:${k}">
        <line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${pt.l[1]}"/>
        <circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="4"/>
        <rect x="${bx}" y="${by}" width="${wBox}" height="30" rx="15"/>
        <text x="${bx + wBox / 2}" y="${pt.l[1] + 4.5}" text-anchor="middle">${esc(text)}</text>
      </g>`;
    }).join('');
    const svg = `<svg class="tech-art" viewBox="0 0 400 320" aria-hidden="true" focusable="false">
      <g class="grid">${grid}</g>
      <circle class="ring" cx="200" cy="160" r="132"/>
      <circle class="ring ring--b" cx="200" cy="160" r="96"/>
      <g class="draw" transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${S})" stroke-width="${(2 / S).toFixed(3)}">${shapes}</g>
      ${callouts}
    </svg>`;
    panel.insertAdjacentHTML('afterbegin', svg);
  }
  function initTech() {
    const items = $$('.tech__item');
    const panels = $$('.tech__panel');
    if (!items.length) return;
    panels.forEach((p) => safe('arte', () => buildArt(p)));
    const draw = (p) => {
      if (reduced()) return;
      p.classList.remove('is-drawing');
      void p.getBoundingClientRect();
      p.classList.add('is-drawing');
    };
    const select = (it, focus) => {
      if (it.classList.contains('is-active') && !focus) return;
      items.forEach((x) => {
        const on = x === it;
        x.classList.toggle('is-active', on);
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = d.getElementById(x.getAttribute('aria-controls'));
        if (!p) return;
        p.hidden = !on;
        p.classList.toggle('is-active', on);
        if (on) draw(p);
      });
      if (focus) it.focus();
    };
    let hoverTimer;
    const stageEl = $('.tech__stage');
    const revealStage = () => {
      if (!stageEl || w.innerWidth > 980) return;
      const r = stageEl.getBoundingClientRect();
      if (r.top < 60 || r.bottom > w.innerHeight) stageEl.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' });
    };
    items.forEach((it, i) => {
      it.addEventListener('click', () => { select(it); revealStage(); });
      it.addEventListener('mouseenter', () => { if (!mqHover.matches) return; clearTimeout(hoverTimer); hoverTimer = setTimeout(() => select(it), 140); });
      it.addEventListener('mouseleave', () => clearTimeout(hoverTimer));
      it.addEventListener('keydown', (e) => {
        const map = { ArrowDown: i + 1, ArrowUp: i - 1, ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(items[(map[e.key] + items.length) % items.length], true);
      });
    });
    panels.forEach((p) => { if (!p.classList.contains('is-active')) p.hidden = true; });
    /* Dibuja la primera ilustración cuando el escenario entra en pantalla */
    const stage = $('.tech__stage');
    if (stage && 'IntersectionObserver' in w) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(stage);
          const p = panels.find((x) => x.classList.contains('is-active'));
          if (p) draw(p);
        });
      }, { threshold: 0.35 });
      io.observe(stage);
    }
  }

  /* ------------------------------------------------------------------------
     9. Galería: carrusel con arrastre + lightbox con teclado y gestos
     ------------------------------------------------------------------------ */
  const Lightbox = (() => {
    const el = $('#lightbox');
    if (!el) return { bind() {} };
    const img = $('#lb-img');
    const cap = $('#lb-cap');
    const count = $('#lb-count');
    const fig = $('.lightbox__figure', el);
    let list = [];
    let i = 0;
    let trigger = null;
    let timer = null;
    const set = (n, swap) => {
      i = (n + list.length) % list.length;
      const b = list[i];
      const src = $('img', b);
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      const c = $('.g-item__cap', b);
      cap.innerHTML = c ? c.innerHTML : '';
      count.textContent = `${i + 1} / ${list.length}`;
      if (swap && !reduced()) { fig.classList.remove('is-swapping'); void fig.offsetWidth; fig.classList.add('is-swapping'); }
    };
    const open = (n, from) => {
      clearTimeout(timer);
      trigger = from;
      set(n, false);
      if (el.hidden) lockScroll(true);
      el.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-open')));
      setTimeout(() => $('.lightbox__close', el).focus({ preventScroll: true }), 30);
    };
    const close = () => {
      if (el.hidden) return;
      el.classList.remove('is-open');
      timer = setTimeout(() => { el.hidden = true; lockScroll(false); }, reduced() ? 0 : 340);
      if (trigger) trigger.focus({ preventScroll: true });
    };
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-lb-close]')) close();
      const nav = e.target.closest('[data-lb-nav]');
      if (nav) set(i + Number(nav.dataset.lbNav), true);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      else if (e.key === 'ArrowRight') set(i + 1, true);
      else if (e.key === 'ArrowLeft') set(i - 1, true);
      else trapTab(e, el);
    });
    let sx = null;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    el.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 50) set(i + (dx < 0 ? 1 : -1), true);
    });
    return { bind(buttons) { list = buttons; buttons.forEach((b, n) => b.addEventListener('click', () => open(n, b))); } };
  })();

  function initGallery() {
    const track = $('#gallery-track');
    if (!track) return;
    const items = $$('.g-item', track);
    const prev = $('[data-gal="prev"]');
    const next = $('[data-gal="next"]');
    const progress = $('.gallery__progress');
    const positions = () => {
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      return items.map((it) => it.offsetLeft - pad);
    };
    const go = (dir) => {
      const pos = positions();
      const x = track.scrollLeft;
      const target = dir > 0 ? pos.find((p) => p > x + 6) : [...pos].reverse().find((p) => p < x - 6);
      track.scrollTo({ left: target ?? (dir > 0 ? track.scrollWidth : 0), behavior: reduced() ? 'auto' : 'smooth' });
    };
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const ratio = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      if (progress) progress.style.setProperty('--prog', `${Math.round((ratio + p * (1 - ratio)) * 100)}%`);
      if (prev) prev.disabled = track.scrollLeft < 6;
      if (next) next.disabled = track.scrollLeft > max - 6;
    };
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    onResize(update);
    update();

    /* Arrastre con mouse (en táctil se usa el desplazamiento nativo) */
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;
    let settle = null;
    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
      clearTimeout(settle);
    });
    w.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 5) { track.classList.add('is-dragging'); e.preventDefault(); }
      if (track.classList.contains('is-dragging')) track.scrollLeft = startLeft - dx;
    });
    w.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (!track.classList.contains('is-dragging')) return;
      const pos = positions();
      const x = track.scrollLeft;
      const nearest = pos.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), pos[0]);
      track.scrollTo({ left: nearest, behavior: reduced() ? 'auto' : 'smooth' });
      settle = setTimeout(() => track.classList.remove('is-dragging'), 420);
    });
    track.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    track.addEventListener('dragstart', (e) => e.preventDefault());
    track.addEventListener('keydown', (e) => {
      if (e.target !== track) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    Lightbox.bind($$('.g-item__btn', track));
  }

  /* ------------------------------------------------------------------------
     10. Testimonios: carrusel con autoplay que se pausa al interactuar
     ------------------------------------------------------------------------ */
  function initTestimonials() {
    const car = $('.t-carousel');
    if (!car) return;
    const slides = $$('.quote', car);
    const dotsWrap = $('.t-carousel__dots', car);
    const bar = $('.t-carousel__bar span', car);
    const btnPrev = $('[data-t="prev"]');
    const btnNext = $('[data-t="next"]');
    const btnToggle = $('[data-t="toggle"]');
    const DUR = 7000;
    car.style.setProperty('--t-dur', `${DUR}ms`);
    let i = 0;
    let timer = null;
    let started = 0;
    let remaining = DUR;
    let userStopped = false;
    let hovered = false;
    let inView = false;

    const dots = slides.map((s, n) => {
      const b = d.createElement('button');
      b.type = 'button';
      b.className = 't-dot';
      b.setAttribute('aria-label', `Ir al testimonio ${n + 1}`);
      b.addEventListener('click', () => { go(n); stopByUser(); });
      dotsWrap.appendChild(b);
      return b;
    });
    const canPlay = () => !userStopped && !hovered && inView && !reduced() && !d.hidden;
    const restartBar = () => { car.classList.remove('is-playing'); void bar.offsetWidth; };
    function go(n) {
      const prevI = i;
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle('is-active', on);
        s.classList.toggle('is-leaving', k === prevI && !on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        s.inert = !on;
      });
      dots.forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
      remaining = DUR;
      restartBar();
      if (timer) { clearTimeout(timer); timer = null; play(); }
    }
    function play() {
      if (!canPlay() || timer) { car.classList.toggle('is-paused', !canPlay()); return; }
      started = performance.now();
      car.classList.add('is-playing');
      car.classList.remove('is-paused');
      timer = setTimeout(() => { timer = null; go(i + 1); play(); }, remaining);
    }
    function pause() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        remaining = Math.max(400, remaining - (performance.now() - started));
      }
      car.classList.add('is-paused');
    }
    const syncToggle = () => {
      if (!btnToggle) return;
      btnToggle.setAttribute('aria-pressed', String(userStopped));
      btnToggle.setAttribute('aria-label', userStopped ? 'Reanudar el carrusel' : 'Pausar el carrusel');
      $('use', btnToggle).setAttribute('href', userStopped ? '#play' : '#pause');
    };
    function stopByUser() { userStopped = true; pause(); restartBar(); syncToggle(); }
    btnPrev?.addEventListener('click', () => { go(i - 1); stopByUser(); });
    btnNext?.addEventListener('click', () => { go(i + 1); stopByUser(); });
    btnToggle?.addEventListener('click', () => {
      userStopped = !userStopped;
      syncToggle();
      if (userStopped) pause(); else { remaining = DUR; restartBar(); play(); }
    });
    car.addEventListener('mouseenter', () => { hovered = true; pause(); });
    car.addEventListener('mouseleave', () => { hovered = false; play(); });
    car.addEventListener('focusin', () => { hovered = true; pause(); });
    car.addEventListener('focusout', () => { hovered = car.matches(':hover'); play(); });
    d.addEventListener('visibilitychange', () => (d.hidden ? pause() : play()));
    let sx = null;
    const vp = $('.t-carousel__viewport', car);
    vp.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    vp.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx;
      sx = null;
      if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); stopByUser(); }
    });
    if ('IntersectionObserver' in w) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) play(); else pause();
      }, { threshold: 0.4 }).observe(car);
    }
    go(0);
    syncToggle();
    if (reduced()) { userStopped = true; syncToggle(); }
  }

  /* ------------------------------------------------------------------------
     11. Preguntas frecuentes (una abierta a la vez en móvil)
     ------------------------------------------------------------------------ */
  function initFAQ() {
    const accs = $$('.acc');
    const setAcc = (acc, open) => {
      acc.classList.toggle('is-open', open);
      $('.acc__btn', acc).setAttribute('aria-expanded', String(open));
    };
    accs.forEach((acc) => {
      $('.acc__btn', acc).addEventListener('click', () => {
        const open = acc.classList.contains('is-open');
        if (!open && mqMobile.matches) accs.forEach((o) => { if (o !== acc) setAcc(o, false); });
        setAcc(acc, !open);
      });
    });
  }

  /* ------------------------------------------------------------------------
     12. Formulario de cita en 4 pasos (simulado: no envía datos)
     ------------------------------------------------------------------------ */
  const Booking = (() => {
    const form = $('#booking-form');
    if (!form) return { prefill() {} };
    const card = form.closest('.booking__card');
    const steps = $$('.bk__step', form);
    const stepLis = $$('.bk__steps li', form);
    const bar = $('.bk__bar', form);
    const back = $('#bk-back');
    const next = $('#bk-next');
    const submit = $('#bk-submit');
    const success = $('#bk-success');
    const prefillBox = $('#bk-prefill');
    const motivo = $('#bk-motivo');
    const cal = $('#bk-cal');
    let step = 1;
    let maxStep = 1;
    let fecha = null;

    const val = (name) => {
      const el = form.elements[name];
      if (!el) return '';
      if (typeof RadioNodeList !== 'undefined' && el instanceof RadioNodeList) return el.value;
      if (el.type === 'checkbox') return el.checked;
      return (el.value || '').trim();
    };

    const fillMotivos = (doctor, selected = '') => {
      motivo.innerHTML = '';
      if (!doctor) { motivo.disabled = true; motivo.add(new Option('Primero elige un especialista', '')); return; }
      motivo.disabled = false;
      motivo.add(new Option('Elige un motivo', ''));
      TRATAMIENTOS.filter((t) => t.doctor === doctor).forEach((t) => motivo.add(new Option(t.titulo, t.id)));
      motivo.add(new Option('Otro motivo o no estoy seguro/a', 'otro'));
      motivo.value = selected;
    };

    const buildCal = () => {
      const doctor = val('doctor');
      const sede = val('sede');
      const hint = $('#bk-fecha-hint');
      if (!doctor || !sede) {
        hint.textContent = 'Elige primero especialista y sede para ver los días disponibles.';
        cal.innerHTML = '<p class="cal__empty">Los días disponibles aparecerán aquí.</p>';
        return;
      }
      const dias = HORARIOS[doctor] ? HORARIOS[doctor][sede] : null;
      const doc = DOCTORES[doctor];
      const conArticulo = `${doc.articulo === 'la' ? 'La' : 'El'} ${doc.nombre}`;
      const delDoctor = `${doc.articulo === 'la' ? 'de la' : 'del'} ${doc.nombre}`;
      hint.textContent = dias
        ? `${conArticulo} atiende en ${SEDES[sede].corto} los ${dias.map((n) => DIAS_LARGO[n]).join(', ').replace(/, ([^,]*)$/, ' y $1')}.`
        : `El horario ${delDoctor} en ${SEDES[sede].corto} está por confirmar: elige tu día preferido y te lo confirmamos.`;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const start = new Date(today);
      start.setDate(start.getDate() + 1);
      while (start.getDay() === 0 || start.getDay() === 6) start.setDate(start.getDate() + 1);
      start.setDate(start.getDate() - (start.getDay() - 1));
      let html = '';
      for (let wk = 0; wk < 3; wk += 1) {
        const monday = new Date(start); monday.setDate(start.getDate() + wk * 7);
        html += `<p class="cal__week">Semana del ${monday.getDate()} de ${MESES[monday.getMonth()]}</p>`;
        for (let k = 0; k < 5; k += 1) {
          const dt = new Date(monday); dt.setDate(monday.getDate() + k);
          const iso = toISO(dt);
          const wd = dt.getDay();
          const past = dt <= today;
          const off = dias ? !dias.includes(wd) : false;
          const dis = past || off;
          const pressed = fecha === iso && !dis;
          const label = `${fmtFecha.format(dt)}${past ? ' (no disponible)' : off ? ' (sin consulta)' : ''}`;
          html += `<button type="button" class="cal__day" data-date="${iso}" aria-pressed="${pressed}" aria-label="${label}"${dis ? ' disabled' : ''}><small>${DIAS[wd]}</small><strong>${dt.getDate()}</strong><span class="cal__m">${MESES[dt.getMonth()]}</span></button>`;
        }
      }
      cal.innerHTML = html;
      if (fecha && !$(`.cal__day[data-date="${fecha}"]:not(:disabled)`, cal)) fecha = null;
    };

    const RULES = {
      nombre: (v) => (!v ? 'Escribe tu nombre y apellido.' : v.split(/\s+/).filter(Boolean).length < 2 ? 'Escribe al menos un nombre y un apellido.' : ''),
      telefono: (v) => {
        if (!v) return 'Escribe un teléfono para confirmar la cita.';
        const digits = v.replace(/\D/g, '');
        if (/^\s*\+/.test(v)) return digits.length >= 8 && digits.length <= 15 ? '' : 'Revisa el número internacional: entre 8 y 15 dígitos después del +.';
        const local = digits.length === 11 && digits[0] === '1' ? digits.slice(1) : digits;
        return local.length === 10 && /^(809|829|849)/.test(local) ? '' : 'Revisa el número: 10 dígitos que empiecen por 809, 829 u 849, o usa + si es internacional.';
      },
      correo: (v) => (!v ? '' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Revisa el correo: falta la @ o el dominio (ej.: nombre@correo.com).'),
      doctor: (v) => (v ? '' : 'Elige un especialista.'),
      motivo: (v) => (v ? '' : 'Elige el motivo de la consulta.'),
      sede: (v) => (v ? '' : 'Elige una sede.'),
      fecha: () => (fecha ? '' : 'Elige una fecha disponible en el calendario.'),
      franja: (v) => (v ? '' : 'Elige mañana o tarde.'),
      consentimiento: (v) => (v ? '' : 'Necesitamos tu autorización para contactarte y confirmar la cita.')
    };
    const STEP_FIELDS = { 1: ['nombre', 'telefono', 'correo'], 2: ['doctor', 'motivo'], 3: ['sede', 'fecha', 'franja'], 4: ['consentimiento'] };
    const TEXTUAL = ['nombre', 'telefono', 'correo'];

    const showError = (name, msg) => {
      const f = $(`[data-field="${name}"]`, form);
      if (!f) return;
      const err = $('.field__error', f);
      f.classList.toggle('is-invalid', !!msg);
      f.classList.toggle('is-valid', !msg && TEXTUAL.includes(name) && !!val(name));
      if (err) err.innerHTML = msg ? `${icon('alert')}<span>${esc(msg)}</span>` : '';
      const input = $('input:not([type="radio"]):not([type="checkbox"]), select', f);
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };
    const validateStep = (n, focus) => {
      let firstBad = null;
      STEP_FIELDS[n].forEach((name) => {
        const msg = RULES[name](val(name));
        showError(name, msg);
        if (msg && !firstBad) firstBad = name;
      });
      if (firstBad && focus) {
        const f = $(`[data-field="${firstBad}"]`, form);
        const target = $('input:not([type="hidden"]), select, .cal__day:not(:disabled)', f);
        if (target) target.focus();
        if (!reduced()) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
      }
      return !firstBad;
    };

    form.addEventListener('focusout', (e) => {
      const f = e.target.closest('[data-field]');
      if (!f || !TEXTUAL.includes(f.dataset.field)) return;
      const name = f.dataset.field;
      if (val(name) || f.classList.contains('is-invalid')) showError(name, RULES[name](val(name)));
    });
    form.addEventListener('input', (e) => {
      const f = e.target.closest('[data-field]');
      if (f && f.classList.contains('is-invalid') && RULES[f.dataset.field]) showError(f.dataset.field, RULES[f.dataset.field](val(f.dataset.field)));
    });
    form.addEventListener('change', (e) => {
      const name = e.target.name;
      if (name === 'doctor') { fillMotivos(val('doctor')); showError('doctor', ''); buildCal(); }
      if (name === 'sede') { showError('sede', ''); buildCal(); }
      if (name === 'motivo') showError('motivo', RULES.motivo(val('motivo')));
      if (name === 'franja') showError('franja', '');
      if (name === 'consentimiento') showError('consentimiento', RULES.consentimiento(val('consentimiento')));
    });
    cal.addEventListener('click', (e) => {
      const b = e.target.closest('.cal__day');
      if (!b || b.disabled) return;
      $$('.cal__day', cal).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      fecha = b.dataset.date;
      showError('fecha', '');
    });
    cal.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 5, ArrowUp: -5 };
      if (!(e.key in keys)) return;
      const days = $$('.cal__day', cal);
      let k = days.indexOf(d.activeElement);
      if (k < 0) return;
      e.preventDefault();
      do { k += keys[e.key]; } while (days[k] && days[k].disabled);
      if (days[k]) days[k].focus();
    });

    const updateUI = () => {
      back.hidden = step === 1;
      next.hidden = step === 4;
      submit.hidden = step !== 4;
      $('span', bar).style.setProperty('--pct', `${(step / 4) * 100}%`);
      bar.setAttribute('aria-valuenow', String(step));
      bar.setAttribute('aria-valuetext', `Paso ${step} de 4`);
      stepLis.forEach((li, k) => {
        const n = k + 1;
        li.classList.toggle('is-current', n === step);
        li.classList.toggle('is-done', n < maxStep && n !== step);
        const b = $('button', li);
        b.disabled = n > maxStep;
        if (n === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    };
    const focusStep = (el) => {
      const lg = $('.bk__legend', el);
      if (lg) { lg.setAttribute('tabindex', '-1'); lg.focus({ preventScroll: true }); }
      const r = card.getBoundingClientRect();
      if (r.top < 0 || r.top > w.innerHeight * 0.5) card.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    };
    const go = (n) => {
      if (n === step || n < 1 || n > 4) return;
      const from = steps[step - 1];
      const to = steps[n - 1];
      const forward = n > step;
      step = n;
      maxStep = Math.max(maxStep, n);
      if (n === 4) renderSummary();
      updateUI();
      const swap = () => {
        from.hidden = true; from.classList.remove('is-active');
        to.hidden = false; to.classList.add('is-active');
        if (!reduced() && to.animate) to.animate([{ opacity: 0, transform: `translateX(${forward ? 26 : -26}px)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: EASE });
        focusStep(to);
      };
      if (!reduced() && from.animate) {
        const a = from.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${forward ? -22 : 22}px)` }], { duration: 170, easing: 'ease-in' });
        a.onfinish = swap;
      } else swap();
    };
    next.addEventListener('click', () => { if (validateStep(step, true)) go(step + 1); });
    back.addEventListener('click', () => go(step - 1));
    stepLis.forEach((li, k) => $('button', li).addEventListener('click', () => {
      const n = k + 1;
      if (n < step) go(n);
      else if (n > step && n <= maxStep && validateStep(step, true)) go(n);
    }));
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('input:not([type="checkbox"]):not([type="radio"])') && step < 4) { e.preventDefault(); next.click(); }
    });

    const rows = (withEdit) => {
      const doc = DOCTORES[val('doctor')];
      const sede = SEDES[val('sede')];
      const t = TRATAMIENTOS.find((x) => x.id === val('motivo'));
      const list = [
        ['Paciente', val('nombre'), 1],
        ['Teléfono', val('telefono'), 1],
        val('correo') ? ['Correo', val('correo'), 1] : null,
        ['Especialista', doc ? doc.nombre : '', 2],
        ['Motivo', t ? t.titulo : 'Otro motivo o no estoy seguro/a', 2],
        val('seguro') ? ['Seguro', val('seguro'), 2] : null,
        ['Sede', sede ? sede.nombre : '', 3],
        ['Fecha', fechaLarga(fecha), 3],
        ['Horario', val('franja') === 'manana' ? 'Mañana' : 'Tarde', 3]
      ].filter(Boolean);
      return list.map(([k, v, s]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd>${withEdit ? `<button type="button" class="bk__edit" data-edit="${s}" aria-label="Editar ${k.toLowerCase()}">Editar</button>` : ''}</div>`).join('');
    };
    const renderSummary = () => { $('#bk-summary').innerHTML = rows(true); };
    $('#bk-summary').addEventListener('click', (e) => { const b = e.target.closest('[data-edit]'); if (b) go(Number(b.dataset.edit)); });

    const refCode = () => {
      const n = new Date();
      return `AM-${String(n.getFullYear()).slice(2)}${String(n.getMonth() + 1).padStart(2, '0')}${String(n.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    };
    const showSuccess = () => {
      const doc = DOCTORES[val('doctor')];
      const sede = SEDES[val('sede')];
      $('#bk-success-text').textContent = `Te llamaremos al ${val('telefono')} para confirmar tu cita con ${doc.articulo} ${doc.nombre} en ${sede.corto}: ${fechaLarga(fecha)}, en la ${val('franja') === 'manana' ? 'mañana' : 'tarde'}.`;
      $('#bk-success-summary').innerHTML = rows(false);
      $('#bk-ref').textContent = refCode();
      form.hidden = true;
      prefillBox.hidden = true;
      success.hidden = false;
      if (!reduced() && success.animate) success.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: EASE });
      success.focus({ preventScroll: true });
      const r = card.getBoundingClientRect();
      if (r.top < 0) card.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (step !== 4) { next.click(); return; }
      if (!validateStep(4, true)) return;
      submit.classList.add('is-loading');
      submit.setAttribute('aria-busy', 'true');
      $('.btn__label', submit).textContent = 'Enviando…';
      setTimeout(() => {
        submit.classList.remove('is-loading');
        submit.removeAttribute('aria-busy');
        submit.classList.add('is-success');
        $('.btn__label', submit).textContent = 'Solicitud lista';
        $('use', submit).setAttribute('href', '#check');
        setTimeout(showSuccess, reduced() ? 0 : 700);
      }, reduced() ? 200 : 1600);
    });

    const reset = () => {
      form.reset();
      fecha = null;
      step = 1;
      maxStep = 1;
      steps.forEach((s, k) => { s.hidden = k !== 0; s.classList.toggle('is-active', k === 0); });
      Object.keys(RULES).forEach((n) => showError(n, ''));
      $$('.field', form).forEach((f) => f.classList.remove('is-valid'));
      fillMotivos('');
      buildCal();
      submit.classList.remove('is-success', 'is-loading');
      $('.btn__label', submit).textContent = 'Solicitar cita';
      success.hidden = true;
      form.hidden = false;
      prefillBox.hidden = true;
      updateUI();
      $('#bk-nombre').focus({ preventScroll: true });
    };
    $('#bk-new').addEventListener('click', reset);

    const prefill = (doctor, motivoId) => {
      if (form.hidden) reset();
      const radio = doctor ? form.querySelector(`input[name="doctor"][value="${doctor}"]`) : null;
      if (radio) { radio.checked = true; fillMotivos(doctor, motivoId || ''); showError('doctor', ''); buildCal(); }
      const t = TRATAMIENTOS.find((x) => x.id === motivoId);
      $('span', prefillBox).textContent = t ? `Preseleccionado: ${t.titulo} · ${DOCTORES[doctor].nombre}` : `Preseleccionado: ${DOCTORES[doctor].nombre}`;
      prefillBox.hidden = false;
      const target = d.getElementById('agendar');
      target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => $('#bk-nombre').focus({ preventScroll: true }), reduced() ? 0 : 750);
    };
    $('.booking__prefill-x', prefillBox).addEventListener('click', () => {
      prefillBox.hidden = true;
      $$('input[name="doctor"]', form).forEach((r) => { r.checked = false; });
      fillMotivos('');
      buildCal();
    });

    fillMotivos('');
    buildCal();
    updateUI();
    steps.forEach((s, k) => { s.hidden = k !== 0; });
    return { prefill };
  })();

  /* ------------------------------------------------------------------------
     13. WhatsApp flotante con selector de sede
     ------------------------------------------------------------------------ */
  function initWhatsApp() {
    const wa = $('#wa');
    const btn = $('#wa-btn');
    const panel = $('#wa-panel');
    if (!wa || !btn || !panel) return;
    const hero = $('.hero');
    const avoid = [$('.booking__card'), $('.footer')].filter(Boolean);
    let pastHero = false;
    const overlapping = new Set();
    const refresh = () => {
      const hide = (!pastHero || overlapping.size > 0) && panel.hidden;
      wa.classList.toggle('is-hidden', hide);
    };
    if ('IntersectionObserver' in w) {
      if (hero) new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; refresh(); }, { rootMargin: '-45% 0px 0px 0px' }).observe(hero);
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? overlapping.add(e.target) : overlapping.delete(e.target)));
        refresh();
      }, { threshold: 0.12 });
      avoid.forEach((el) => io.observe(el));
    } else pastHero = true;
    const setOpen = (open, focus = true) => {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      refresh();
      if (open && focus) setTimeout(() => $('a', panel).focus({ preventScroll: true }), 20);
    };
    btn.addEventListener('click', () => setOpen(panel.hidden));
    $('.wa__close', panel).addEventListener('click', () => { setOpen(false); btn.focus(); });
    d.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-wa-open]');
      if (opener) {
        e.preventDefault();
        if (Modal.isOpen()) Modal.close(false);
        setOpen(true);
        return;
      }
      if (!panel.hidden && !wa.contains(e.target)) setOpen(false, false);
    });
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); } });
    refresh();
  }

  /* ------------------------------------------------------------------------
     14. Utilidades: copiar teléfono, mapas bajo demanda y año
     ------------------------------------------------------------------------ */
  function initCopy() {
    $$('[data-copy]').forEach((b) => {
      const label = $('span', b);
      const use = $('use', b);
      const original = label ? label.textContent : '';
      b.addEventListener('click', () => {
        const text = b.dataset.copy;
        const done = (ok) => {
          b.classList.toggle('is-success', ok);
          if (label) label.textContent = ok ? 'Copiado' : 'Selecciónalo';
          if (use) use.setAttribute('href', ok ? '#check' : '#copy');
          if (!ok) {
            const link = b.previousElementSibling;
            const sel = w.getSelection();
            if (link && sel) { const range = d.createRange(); range.selectNodeContents(link); sel.removeAllRanges(); sel.addRange(range); }
          }
          setTimeout(() => { b.classList.remove('is-success'); if (label) label.textContent = original; if (use) use.setAttribute('href', '#copy'); }, 1800);
        };
        try {
          const p = navigator.clipboard && navigator.clipboard.writeText(text);
          if (p && p.then) p.then(() => done(true), () => done(false)); else done(false);
        } catch (err) { done(false); }
      });
    });
  }

  function initMaps() {
    if (w.__AM_ARTIFACT__) return;
    $$('.loc__embed[data-embed]').forEach((box) => {
      const b = d.createElement('button');
      b.type = 'button';
      b.className = 'btn btn--ghost btn--sm';
      b.innerHTML = `<span class="btn__label">Cargar mapa interactivo</span><span class="btn__icon">${icon('map')}</span>`;
      b.addEventListener('click', () => {
        const f = d.createElement('iframe');
        f.src = box.dataset.embed;
        f.loading = 'lazy';
        f.title = 'Mapa de la sede';
        f.referrerPolicy = 'no-referrer-when-downgrade';
        box.replaceChildren(f);
      });
      box.appendChild(b);
    });
  }

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  safe('revelado', () => Reveal.init());
  safe('contadores', initCounters);
  safe('imágenes', initImages);
  safe('navegación', initNav);
  safe('parallax', initParallax);
  safe('tecnología (marco)', initTechFrame);
  safe('tratamientos', initTreatments);
  safe('especialistas', initDoctorTabs);
  safe('tecnología', initTech);
  safe('galería', initGallery);
  safe('testimonios', initTestimonials);
  safe('preguntas', initFAQ);
  safe('whatsapp', initWhatsApp);
  safe('copiar', initCopy);
  safe('mapas', initMaps);
  mqReduce.addEventListener('change', () => scrollFns.forEach((fn) => safe('scroll', fn)));

  w.AM = { TRATAMIENTOS, DOCTORES, SEDES, HORARIOS, Modal, Booking };
})();

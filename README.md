# Abud & Martínez — prototipo web

Sitio de una página para la pareja de especialistas **Dr. Alejandro J. Abud Gómez** (cirujano ortopeda) y **Dra. Libby E. Martínez de Abud** (cirujana uróloga), con atención en Bávaro (Innovacare Internacional Center) y San Pedro de Macorís.

- Proyecto WebDom nuevo e independiente: no pertenece a `webdom-site`, `webdom-citas`, Martis ni DentalSpace.
- Estado: **prototipo de alta fidelidad para revisión**. No está publicado, no tiene repositorio ni dominio, y el formulario no envía datos.
- Inspiración: estructura y lenguaje de interacción de la plantilla Dentara (Framer). No se copiaron textos, fotos, marca ni diseño exacto.
- Paleta: verdes y teal de Innovacare + degradado verde salvia → teal → azul noche del gráfico del Dr. Abud.

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Contenido, secciones y sprite de íconos en línea |
| `styles.css` | Tokens, componentes, secciones, movimiento y responsive (1440 / 768 / 390) |
| `script.js` | Datos editables (doctores, sedes, horarios, 11 tratamientos) e interacciones |
| `revision.js` · `revision.css` | Herramientas de revisión: anotaciones, datos por confirmar y sistema de diseño. **Eliminar en producción** |
| `vista-responsive.html` | Las tres vistas (escritorio, tablet, móvil) una junto a otra |
| `images/` | Fotos recortadas y limpiadas del material entregado, favicon e imagen para compartir |

No necesita build. Para verlo en local: `npx serve .` y abrir `http://localhost:3000` (o `python -m http.server`).

## Cómo revisar el prototipo

Botón oscuro en el borde izquierdo inferior («Revisión»):

1. **Anotaciones de movimiento**: 19 marcadores numerados sobre la página. Cada uno explica animación, estados y comportamiento.
2. **Datos por confirmar**: lista para el cliente y todas las marcas «por confirmar» de la página (clic para ir a cada una).
3. **Sistema de diseño**: colores, tipografía, botones con sus 7 estados, campos, espaciado, radios, sombras, curvas de movimiento y puntos de corte.
4. **Resaltar pendientes en la página**.

Cada tratamiento tiene enlace directo: `index.html#tratamiento-artroscopia`, `#tratamiento-prostata`, etc.

## Datos usados y su fuente

| Dato | Fuente |
|---|---|
| Nombres, especialidades, teléfonos 849-449-7353 (Bávaro) y 829-515-0011 (San Pedro) | Instagram @dr.alejandroabud y @dra.libbyurologa (revisión del 23-sep-2026) |
| Áreas del Dr. Abud: artroscopia de rodilla y hombro, cirugía endoscópica de columna lumbar, terapia celular (PRP, exosomas, células madre) | Gráfico entregado del Dr. Abud |
| Ortopeda traumatólogo, ortopeda infantil, reemplazo articular | Bordado de la bata/chaqueta y doctorabud.com |
| Formación del Dr. Abud (UCE 2005–2010, residencia de Cirugía General 2012–2014, posgrado de Ortopedia y Traumatología 2014–2017) | doctorabud.com (sitio anterior). **Validar** |
| Descripciones y síntomas de ortopedia; proceso preparación → diagnóstico → consulta | doctorabud.com, reescrito en lenguaje general. **Validación médica pendiente** |
| Áreas de la Dra. Libby: urología femenina; cirugías mínimamente invasivas de próstata, riñones y cálculos | Gráfico entregado de la Dra. Libby |
| Sedes de la Dra. Libby: Innovacare (Av. Barceló, Plaza Terranova, al lado de Atlantis) L-Mi-V con cita; Centro Hospitalario UCE (C/ Presidente Henríquez #3) Ma-J 8:30–3:00 | Publicación de Instagram de octubre 2025. **Confirmar vigencia** |
| Frase «Queremos transformar la experiencia sanitaria…» | Gráfico «Quiénes somos» de Innovacare entregado |

No se inventaron cifras, reseñas, certificaciones ni resultados. Los indicadores (2 especialistas, 2 sedes, 11 áreas, 3 terapias regenerativas) salen de los datos anteriores; «11» se calcula desde la lista de tratamientos.

## Pendiente de confirmar con los doctores

- Número oficial de WhatsApp por sede (Instagram muestra 849-449-7353 y 829-515-0011; doctorabud.com indica 829-257-6632 como WhatsApp).
- Horarios del Dr. Abud en Bávaro y San Pedro, y su dirección en San Pedro (¿también CHUCE?).
- Vigencia de los horarios de la Dra. Libby.
- Lista de ARS aceptadas.
- Formación y certificaciones de la Dra. Libby; certificaciones y membresías del Dr. Abud.
- Procedimientos específicos de urología femenina y articulaciones que trata en reemplazo articular.
- Revisión médica de los textos de cada tratamiento.
- Fotografías originales en alta resolución (las actuales vienen de Instagram) y fotos de sedes/quirófano con autorización.
- Testimonios reales con autorización escrita (hoy son espacios de ejemplo marcados «Pendiente de autorización»).
- Aprobación del nombre «Abud & Martínez» y del logotipo tipográfico (el «&» es la marca).
- Dominio y publicación: abudinfo.com hoy redirige a Linktree; doctorabud.com tiene sedes y horarios antiguos.

## Sistema de diseño

**Color** (tokens en `:root` de `styles.css`)

| Token | Valor | Uso |
|---|---|---|
| `--verde-600` | `#1E7A43` | Botón principal (5,4:1 con blanco) |
| `--teal-600` | `#127369` | Final del degradado del CTA (5,7:1) |
| `--verde-700` | `#1B6B3C` | Texto verde, etiquetas (6,5:1) |
| `--verde-300` | `#86C267` | Acentos sobre azul noche (8,2:1) |
| `--verde-400` | `#3FA64A` | Verde Innovacare, solo decorativo |
| `--azul-900` / `--azul-700` | `#0C1A33` / `#1D3566` | Secciones oscuras, pie, final del degradado |
| `--tinta` / `--pizarra` / `--gris` | `#0E1F38` / `#42495B` / `#5E6778` | Títulos / texto / texto secundario |
| `--niebla` / `--menta` | `#F2F6F8` / `#EFF7F1` | Fondos alternos |
| `--pendiente` | `#8A5A00` sobre `#FFF6E0` | Datos por confirmar |

Degradado de marca (del gráfico del Dr. Abud), en versión profunda para que el texto blanco cumpla contraste AA: `linear-gradient(150deg, #356349, #28585A 32%, #1D4565 64%, #192E5E)`. Acento claro sobre el degradado: `--verde-bruma #C8E6B0` (5:1).

**Tipografía** (Google Fonts): Bricolage Grotesque para títulos (560, interletrado −0,035 a −0,045 em), Figtree para texto e interfaz, Lora Italic para acentos. Escala fluida con `clamp()`: H1 2,5→4,3 rem · H2 2→3,3 rem · H3 1,35→1,7 rem.

**Espaciado y forma**: base 4 px; secciones de 76–136 px; contenedor de 1240 px; margen lateral mínimo 16 px; radios 8 / 12 / 18 / 24 / 32 / 40 px y píldora.

## Estados de botones

| Estado | Comportamiento |
|---|---|
| Normal | Degradado verde → teal, círculo blanco con flecha |
| Hover | Sube 2 px, sombra verde, degradado más profundo, flecha avanza 3 px |
| Active | Escala 0,97 durante 80 ms |
| Focus | Anillo blanco + verde de 3/6 px (`:focus-visible`) |
| Loading | `.is-loading`: el círculo muestra un spinner, texto «Enviando…», clic bloqueado |
| Success | `.is-success`: verde oscuro, check con rebote |
| Disabled | Gris, sin sombra ni movimiento, cursor bloqueado |

## Sistema de movimiento

Todo usa `transform`, `opacity` y `filter`. Curva principal `cubic-bezier(.22, 1, .36, 1)`. El contenido es visible en reposo: un bloque solo se oculta justo antes de entrar en pantalla (si JavaScript falla, todo se ve).

| Elemento | Animación |
|---|---|
| Carga | Navbar baja 8 px → título palabra por palabra (60 ms) → subtítulo, botones y teléfonos (110 ms) |
| Fotos del hero | Blur 16 px → nítido y escala 1,06 → 1; parallax 0,05 / 0,10 / 0,16 (≥ 900 px); flotación de 7 px; sello «&» gira en 26 s |
| Scroll | Bloques suben 30 px con fade; grupos escalonados cada 90 ms |
| Indicadores | Cuentan desde 0 en 1,4 s al entrar en pantalla |
| Hover en fotos | Zoom máximo 3 %, brillo +4 %, overlay |
| Tarjetas | Suben 6 px, ícono gira −5°, flecha avanza 4 px; clic abre el detalle desde la tarjeta |
| Filtros | Píldora deslizante; reacomodo FLIP de 560 ms |
| Tecnología | El panel oscuro se expande a todo el ancho con el scroll; la ilustración se dibuja trazo a trazo |
| Galería | Scroll-snap, arrastre con mouse, deslizamiento táctil; lightbox con teclado y gestos |
| Testimonios | Autoplay de 7 s con barra; pausa al interactuar; botón pausar/reanudar |
| FAQ | Altura animada; + rota a ×; en móvil una respuesta a la vez |
| Formulario | Barra de progreso, pasos con desplazamiento lateral, validación con vibración leve, check dibujado al terminar |
| WhatsApp | Aparece al salir del hero; se oculta sobre el formulario y el pie; pulso cada 8 s |

Con `prefers-reduced-motion: reduce` se desactivan parallax, flotación, marquee, autoplay, dibujo de líneas y revelados. En móvil se quita la flotación continua y el parallax.

## Formulario de citas

Cuatro pasos: datos → especialista y motivo → sede, fecha y horario → confirmación. El calendario usa `HORARIOS` en `script.js` (la Dra. Libby: Bávaro L-Mi-V, San Pedro Ma-J; el Dr. Abud: por confirmar, se permiten días laborables). Valida teléfonos dominicanos (809/829/849) e internacionales con +. **No envía datos**: en producción se puede conectar a la app de citas de WebDom o a WhatsApp cuando el cliente confirme el canal. No pide datos clínicos.

## Antes de publicar

1. Quitar `revision.css` y `revision.js` del `<head>` y del final de `index.html`.
2. Reemplazar los «por confirmar» con datos del cliente (ver lista).
3. Validar los datos estructurados (JSON-LD) y las URL de Google Maps de cada sede.
4. Reemplazar las fotos por originales en alta resolución.
5. Probar en navegador real: consola, enlaces, formulario, 1440 / 768 / 390.

## Créditos

Íconos de interfaz: Lucide (licencia ISC). Íconos médicos e ilustraciones: diseño propio. «&» de la marca: glifo de Lora Italic (SIL Open Font License). Fuentes: Google Fonts (OFL).

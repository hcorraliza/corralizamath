# CorralizaMath

Sitio web de CorralizaMath: recursos, clases y materiales de matemáticas
para estudiantes, padres y docentes, con un enfoque claro y práctico.

## Estructura

```
.
├── index.html                          # Página principal
├── css/
│   └── styles.css                      # Estilos del sitio
├── js/
│   └── main.js                         # Interactividad (menú móvil, año dinámico)
├── img/                                 # Imágenes del sitio
├── modulos/
│   └── ia-para-docentes/
│       ├── index.html                  # Módulo interactivo de autoestudio
│       ├── module.css
│       └── module.js
└── recursos/
    └── IA-para-Docentes-Corraliza.pptx # Presentación original descargable
```

## Módulos interactivos

Los talleres de desarrollo profesional se publican como módulos de
autoestudio en `modulos/<nombre-del-modulo>/index.html`, enlazados desde
la sección "Módulos interactivos" de la página principal. Cada módulo:

- Incluye el contenido completo del taller original, organizado en
  secciones navegables desde una barra lateral con seguimiento de progreso.
- Añade actividades interactivas (constructores, acordeones, gráficas,
  autoevaluaciones) que no estaban en la presentación original.
- Ofrece un botón para descargar la presentación `.pptx` original desde
  `recursos/`.
- Guarda el progreso del usuario (casillas marcadas, secciones vistas) en
  `localStorage` del navegador — no requiere servidor ni base de datos.

## Cómo verlo localmente

Al ser un sitio estático, basta con abrir `index.html` en el navegador,
o servirlo localmente:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Publicar con GitHub Pages

1. Ve a **Settings → Pages** en este repositorio.
2. En "Source", selecciona la rama principal (`main`) y la carpeta raíz (`/`).
3. Guarda; GitHub Pages publicará el sitio en unos minutos.

## Contacto

corralizamh@de.pr.gov

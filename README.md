# CorralizaMath

Portal educativo para organizar recursos de matemáticas, desarrollo profesional docente, inteligencia artificial educativa, presentaciones, publicaciones y documentos de referencia del Departamento de Educación de Puerto Rico.

## Estructura principal

```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── img/
│   ├── logo-ore-ponce.svg
│   └── signature.svg
├── matematicas/
│   └── index.html
├── docentes/
│   └── index.html
├── ia-tecnologia/
│   └── index.html
├── presentaciones/
│   └── index.html
├── libros/
│   └── index.html
├── normativas-depr/
│   └── index.html
├── modulos/
│   ├── ia-para-docentes/
│   ├── microaprendizaje-adultos/
│   └── redaccion-examenes-dua/
└── recursos/
    ├── IA-para-Docentes-Corraliza.pptx
    ├── Microaprendizaje-Adultos-RUTA-Corraliza.pptx
    └── Redaccion-Examenes-DUA-Corraliza.pptx
```

## Áreas del portal

- **Matemáticas por niveles:** recursos para 3–5, 6–8 y 9–12.
- **Recursos para docentes:** planificación, DUA, evaluación, microlecciones y materiales profesionales.
- **IA y Tecnología Educativa:** ingeniería de prompts, RC-TTF, herramientas digitales y uso responsable.
- **Presentaciones y talleres:** archivos descargables y módulos interactivos.
- **Libros y publicaciones:** publicaciones propias o cuya distribución esté autorizada.
- **Normativas y Documentos DEPR:** estándares, mapas curriculares, cartas circulares, guías y documentos oficiales.

## Módulos interactivos

Los talleres de desarrollo profesional se publican como módulos de autoestudio en `modulos/<nombre-del-modulo>/index.html`, enlazados desde la sección "Módulos interactivos" de la página principal. Cada módulo:

- Incluye el contenido completo del taller original, organizado en secciones navegables desde una barra lateral con seguimiento de progreso.
- Añade actividades interactivas (constructores, acordeones, gráficas, autoevaluaciones) que no estaban en la presentación original.
- Ofrece un botón para descargar la presentación `.pptx` original desde `recursos/`.
- Guarda el progreso del usuario (casillas marcadas, secciones vistas) en `localStorage` del navegador — no requiere servidor ni base de datos.
- Cierra con una **evaluación final** de 5 preguntas (mínimo 4 correctas para aprobar, con opción de reintentar) que, al aprobarse, habilita un **certificado de aprovechamiento** imprimible: el usuario escribe su nombre, se genera una vista de certificado con el logo del Programa de Matemáticas ORE-Ponce (`img/logo-ore-ponce.svg`) y la firma del facilitador (`img/signature.svg`), y se guarda como PDF desde el diálogo de impresión del navegador (`window.print()`).

## Publicación

La arquitectura del proyecto establece `main` como rama de producción y Cloudflare como medio de publicación. Los cambios enviados a `main` pueden activar un nuevo despliegue automático si la integración está configurada. La existencia de un commit no confirma por sí sola que se haya publicado.

Seleccionar `main` explícitamente al consultar o editar: la rama predeterminada de GitHub puede ser diferente. Verificar el resultado público y el estado de despliegue cuando corresponda.

## Directrices y gestión de recursos

- [Directrices completas de CorralizaMath](docs/directrices-corralizamath.md): documento rector proporcionado por el propietario del proyecto.
- [Instrucciones de trabajo para asistentes y colaboradores](AGENTS.md): aplicación operativa de las directrices a este repositorio.
- [Ficha para incorporar recursos](docs/plantilla-recurso.md): clasificación, datos editoriales, alineación curricular, publicaciones, documentos DEPR y registro de revisión.

Al incorporar un material, revisar el archivo, completar los datos disponibles, clasificarlo, preparar su descripción, enlazarlo desde su sección y comprobar la lectura o descarga. Conservar los módulos, documentos y rutas existentes. Las funciones futuras se implementan de manera progresiva según las necesidades del proyecto.

## Criterio para documentos oficiales

En la sección DEPR se recomienda conservar, cuando sea posible, el título oficial, fecha o vigencia, categoría y enlace a la fuente institucional para facilitar la verificación de versiones.

## Contacto

corralizamh@de.pr.gov

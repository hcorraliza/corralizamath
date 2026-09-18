# Instrucciones de trabajo para CorralizaMath

Estas instrucciones se aplican a todo el repositorio. Antes de modificarlo, leer las [directrices completas del proyecto](docs/directrices-corralizamath.md), suministradas por su propietario, y seguirlas junto con la solicitud actual.

## Propósito y arquitectura

- Mantener un portal educativo riguroso, accesible y útil para el contexto de Puerto Rico.
- GitHub (`hcorraliza/corralizamath`) es la fuente oficial del código y del contenido publicado; Cloudflare es el medio de publicación.
- Trabajar explícitamente sobre `main` para producción. Comprobar la rama: la rama predeterminada de GitHub puede ser distinta.
- Permitir cambios pequeños y seguros en `main`; preparar cambios estructurales importantes en una rama de trabajo y revisarlos antes de integrarlos.
- Verificar el despliegue cuando corresponda; un commit guardado no demuestra que Cloudflare lo haya publicado.

## Estructura que debe conservarse

| Área | Página existente |
| --- | --- |
| Matemáticas: grados 3–5, 6–8 y 9–12 | `matematicas/index.html` |
| Recursos para docentes | `docentes/index.html` |
| IA y Tecnología Educativa | `ia-tecnologia/index.html` |
| Presentaciones y talleres | `presentaciones/index.html` |
| Libros y publicaciones | `libros/index.html` |
| Normativas y Documentos DEPR | `normativas-depr/index.html` |

Conservar los módulos de `modulos/`, las descargas de `recursos/`, los enlaces y el contenido útil existente. No eliminar material por motivo de un rediseño. Antes de reemplazar o renombrar, comprobar dependencias y disponer de una versión recuperable.

## Publicación de recursos

Usar la [ficha de recurso](docs/plantilla-recurso.md) para registrar la información disponible, sin inventar campos faltantes. Revisar el archivo, clasificarlo, preparar su descripción y audiencia, acordar su modalidad cuando no esté definida y enlazarlo desde el área correspondiente. Corregir el contenido del archivo suministrado cuando exista autorización. Conservar sin alteraciones los documentos oficiales.

Priorizar comprensión conceptual, razonamiento, aplicación y resolución de problemas. Cuando corresponda, verificar la alineación con estándares y mapas curriculares oficiales del DEPR y contextualizar a Puerto Rico. Evitar afirmaciones pedagógicas universales sin atender al contexto.

Para IA, RC-TTF significa **Rol, Contexto, Tarea, Tono y Formato**, en ese orden. Mantener supervisión humana, validación, protección de datos, pensamiento crítico, transparencia y uso ético.

## Calidad, evidencia y seguridad

- Revisar exactitud matemática y académica, ortografía, coherencia, navegación, enlaces internos, accesibilidad y funcionamiento móvil de las partes afectadas.
- Usar fuentes primarias y literatura revisada por pares cuando corresponda; referencias APA 7, DOI y enlaces comprobados. Distinguir evidencia y opinión.
- Para documentos DEPR, conservar título y enlace oficial, fecha y estado de vigencia; indicar expresamente cuando la vigencia no se haya confirmado.
- No inventar autores, normas, códigos curriculares, referencias, fechas, enlaces ni resultados. Informar las limitaciones de lo verificado.
- No publicar credenciales, secretos ni información personal sensible. Distribuir obras de terceros únicamente cuando exista autorización, licencia o fundamento legal aplicable.
- Usar nombres nuevos en minúsculas con guiones. Mantener rutas publicadas salvo revisión previa de los enlaces.
- Favorecer cambios incrementales y soluciones sencillas. Las funciones del apartado de desarrollo futuro de las directrices son posibilidades, no tareas que deban implementarse automáticamente.

Al terminar, informar qué cambió, dónde quedó guardado, qué se comprobó y qué permanece pendiente. Priorizar exactitud, integridad del contenido, utilidad educativa, accesibilidad, organización, experiencia de usuario, estabilidad técnica, diseño visual y escalabilidad, en ese orden.

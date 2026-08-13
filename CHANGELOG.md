# Historial de cambios

Todos los cambios relevantes de este proyecto se documentan aquí. El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Corregido

- Se conectó la navegación entre Inicio, Usuarios, Académico y Comunicados después de integrar sus páginas independientes.
- Se unificó la clave de sesión usada por todos los módulos y se redirigen al acceso las visitas sin una sesión válida.
- Se eliminó de `index.html` el contenido residual de la antigua aplicación de una sola página.

### Cambiado

- Se separaron el acceso, el panel de inicio y la gestión de usuarios en `index.html`, `inicio.html` y `usuarios.html`.
- Se conservó el perfil activo entre páginas y se restringió el acceso directo a Usuarios al rol de administración.

## [1.2.0] — 2026-08-13

### Agregado

- Datos académicos independientes para Matemática, Español y Ciencias de 8°A.
- Navegación accesible entre asignaturas con clic y flechas del teclado.
- Indicador de cambios pendientes antes de guardar calificaciones.

### Cambiado

- El botón Guardar cambios conserva simultáneamente las notas de las tres materias.

## [1.1.0] — 2026-08-12

### Cambiado

- El módulo académico ahora vive en `academico.html` y usa `js/academico.js`.
- El tablón de comunicados ahora vive en `comunicados.html` y usa `js/comunicados.js`.
- La navegación conserva el perfil seleccionado mediante `sessionStorage`.
## [1.0.0] — 2026-08-12

### Agregado

- Acceso simulado para administración, docentes y estudiantes/familias.
- Panel de inicio con indicadores, actividades y avisos recientes.
- Alta, búsqueda, filtrado y edición de usuarios.
- Registro y consulta de calificaciones y asistencia según el perfil.
- Creación y consulta de comunicados institucionales.
- Persistencia local de datos de demostración.
- Interfaz responsive y consideraciones básicas de accesibilidad.
- Documentación técnica, requerimientos, decisiones y memoria en Markdown.

# Requerimientos del sistema

## 1. Propósito

Construir un prototipo de intranet para una institución educativa pública que centralice información académica, comunicaciones y administración básica de personas. El sistema demuestra una solución técnica acotada y documentación estructurada en Markdown.

## 2. Personas usuarias

| Perfil | Necesidad principal | Permisos del prototipo |
|---|---|---|
| Administración | Gestionar la operación institucional | Consultar todo, gestionar usuarios, notas y comunicados |
| Docente | Dar seguimiento a sus grupos | Consultar panel, registrar notas y publicar avisos |
| Estudiante/familia | Consultar información individual | Ver únicamente notas, asistencia, actividades y avisos |

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad | Estado |
|---|---|---:|---|
| RF-01 | Permitir acceso simulado mediante selección de perfil y contraseña | Alta | Implementado |
| RF-02 | Mostrar navegación y datos de acuerdo con el perfil activo | Alta | Implementado |
| RF-03 | Permitir a administración crear y editar usuarios | Alta | Implementado |
| RF-04 | Permitir buscar y filtrar personas por perfil | Media | Implementado |
| RF-05 | Permitir a docentes y administración registrar calificaciones | Alta | Implementado |
| RF-06 | Mostrar a estudiante/familia solo su registro académico | Alta | Implementado |
| RF-07 | Mostrar porcentaje de asistencia | Alta | Implementado |
| RF-08 | Permitir a docentes y administración crear comunicados | Alta | Implementado |
| RF-09 | Permitir a todos los perfiles consultar comunicados | Alta | Implementado |
| RF-10 | Conservar cambios locales después de recargar la página | Media | Implementado con `localStorage` |
| RF-11 | Buscar páginas y contenido por palabras o fechas | Media | Implementado |
| RF-12 | Consultar actividades y permitir su gestión a administración y docentes | Media | Implementado |

> **Nota:** la “baja” se modela como estado inactivo para conservar trazabilidad y evitar eliminación irreversible.

## 4. Requerimientos no funcionales

### Accesibilidad

- HTML semántico y etiquetas asociadas a los campos.
- Navegación completa por teclado y foco visible.
- Enlace para saltar al contenido principal.
- Contraste suficiente y contenido que no depende solo del color.
- Adaptación desde 320 px y respeto a `prefers-reduced-motion`.

### Seguridad y privacidad

- Uso exclusivo de datos ficticios.
- Separación visual y funcional por perfiles.
- Exposición mínima de información académica para familias.
- En producción: autenticación de servidor, contraseñas cifradas, sesiones seguras, autorización por recurso, bitácora y cifrado en tránsito.

### Compatibilidad y mantenimiento

- Navegadores modernos con soporte de `dialog` y `localStorage`.
- Sin dependencias externas ni proceso de compilación.
- Código y documentación versionados con Git.

## 5. Criterios de aceptación

1. Al elegir cada perfil, la navegación y el contenido cambian correctamente.
2. Solo administración puede abrir Gestión de usuarios.
3. Una persona creada aparece en la tabla y permanece al recargar.
4. Una calificación guardada permanece al recargar.
5. La familia solo observa la fila académica de Sofía Mora.
6. Un comunicado nuevo aparece primero en el tablón.
7. Todos los controles interactivos se alcanzan con teclado.

## 6. Fuera de alcance

- Autenticación real, recuperación de contraseña y segundo factor.
- Base de datos y servidor multiusuario.
- Matrícula, facturación, mensajería y reserva de recursos.
- Carga o descarga real de archivos.
- Despliegue productivo e integración con sistemas del Ministerio de Educación.

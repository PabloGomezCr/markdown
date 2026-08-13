# Arquitectura del prototipo

## Visión general

Aula Clara es una aplicación web estática multipágina. El inicio y la gestión de usuarios viven en `index.html`; los módulos académico y de comunicados tienen documentos y scripts independientes. El navegador mantiene los cambios de demostración en almacenamiento local.
Aula Clara es una aplicación web estática con páginas separadas para el acceso, Inicio y Usuarios. El navegador comparte la presentación y el comportamiento entre documentos, y mantiene la sesión y los cambios de demostración en almacenamiento local.

```text
┌──────────────────────────────────────────┐
│ Navegador                                │
│                                          │
│ index.html       → inicio y usuarios      │
│ academico.html   → notas y asistencia     │
│ comunicados.html → avisos oficiales       │
│ styles.css       → presentación común     │
│ app.js y scripts por página → interacción │
│ index.html    → acceso simulado          │
│ inicio.html   → panel por perfil         │
│ usuarios.html → gestión administrativa  │
│ styles.css    → presentación responsive │
│ app.js        → sesión, roles e interfaz│
│        ↓                                 │
│ localStorage → users, grades, posts      │
└──────────────────────────────────────────┘
```

## Componentes

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Vistas de acceso, panel de inicio, gestión de usuarios y su modal |
| `css/styles.css` | Sistema visual, layout, estados, responsive y preferencias de movimiento |
| `js/app.js` | Acceso, panel, usuarios y navegación principal |
| `academico.html` y `js/academico.js` | Consulta, edición y persistencia de calificaciones |
| `comunicados.html` y `js/comunicados.js` | Consulta, creación y persistencia de comunicados |
| `index.html` | Formulario de acceso simulado |
| `inicio.html` | Panel e información de Inicio según el perfil activo |
| `usuarios.html` | Formulario, filtros, tabla y modal de gestión de usuarios |
| `css/styles.css` | Sistema visual, layout, estados, responsive y preferencias de movimiento |
| `js/app.js` | Datos semilla, sesión simulada, permisos, renderizado, formularios y persistencia |

## Modelo de datos

```js
User  = { id, name, email, role, active }
Grade = { name, task, project, exam, attendance }
Post  = { id, title, body, date, author, important }
```

## Control de acceso

El prototipo aplica permisos en la interfaz: oculta el enlace de Usuarios para perfiles no administrativos y redirige a Inicio si intentan abrir `usuarios.html` directamente. Esto permite demostrar el flujo, pero **no constituye seguridad real**, porque el código y los datos viven en el cliente.

Para producción, la autorización debe trasladarse al servidor y comprobarse en cada operación. Una arquitectura futura apropiada incluiría API, base de datos relacional, proveedor de identidad, control de acceso basado en roles y bitácora de auditoría.

## Persistencia

Las claves de datos existentes se conservan en `localStorage`; el perfil activo usa `aulaclara-session`. Si los datos de Usuarios o Comunicados no existen, la aplicación utiliza datos semilla. Esta decisión elimina infraestructura para la demostración y hace que la sesión y los cambios sean locales al dispositivo y navegador.

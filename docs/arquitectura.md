# Arquitectura del prototipo

## Visión general

Aula Clara es una aplicación web estática de una sola página. El navegador carga tres archivos y mantiene los cambios de demostración en almacenamiento local.

```text
┌──────────────────────────────────────────┐
│ Navegador                                │
│                                          │
│ index.html  → estructura y accesibilidad │
│ styles.css → presentación responsive     │
│ app.js     → estado, roles e interacción │
│        ↓                                 │
│ localStorage → users, grades, posts      │
└──────────────────────────────────────────┘
```

## Componentes

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Vistas de acceso, panel, usuarios, académico, comunicados y modal |
| `css/styles.css` | Sistema visual, layout, estados, responsive y preferencias de movimiento |
| `js/app.js` | Datos semilla, navegación, permisos, renderizado, formularios y persistencia |

## Modelo de datos

```js
User  = { id, name, email, role, active }
Grade = { name, task, project, exam, attendance }
Post  = { id, title, body, date, author, important }
```

## Control de acceso

El prototipo aplica permisos en la interfaz: oculta módulos y limita filas según el perfil. Esto permite demostrar el flujo, pero **no constituye seguridad real**, porque el código y los datos viven en el cliente.

Para producción, la autorización debe trasladarse al servidor y comprobarse en cada operación. Una arquitectura futura apropiada incluiría API, base de datos relacional, proveedor de identidad, control de acceso basado en roles y bitácora de auditoría.

## Persistencia

Las claves `aulaclara-users`, `aulaclara-grades` y `aulaclara-posts` se almacenan en `localStorage`. Si no existen, la aplicación utiliza datos semilla. Esta decisión elimina infraestructura para la demostración y hace que los cambios sean locales al dispositivo y navegador.

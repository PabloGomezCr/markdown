# Aula Clara — intranet escolar

Prototipo funcional de intranet para la **Escuela Pública Valle Verde**, construido con HTML, CSS y JavaScript sin frameworks. La aplicación simula tres perfiles, gestión de usuarios, seguimiento académico y publicación de comunicados.

## Inicio rápido

No requiere instalación ni dependencias. Se puede abrir `index.html` directamente o levantar un servidor local:

```bash
python3 -m http.server 8080
```

Luego visite `http://localhost:8080`. Seleccione un perfil e ingrese con cualquier contraseña. El acceso redirige a `inicio.html`, desde donde se puede navegar a Académico y Comunicados; administración también puede abrir Usuarios. Los datos se guardan en `localStorage` y el perfil activo se conserva durante la pestaña mediante `sessionStorage`.

## Funciones incluidas

- Inicio de sesión simulado para administración, docentes y estudiantes/familias.
- Consulta de contenido diferenciada por perfil.
- Alta y edición de usuarios para administración.
- Registro de calificaciones para administración y docentes.
- Consulta individual de notas para estudiante/familia.
- Creación y consulta de comunicados.
- Diseño adaptable, navegación por teclado, foco visible y soporte para movimiento reducido.

## Estructura

```text
.
├── AGENTS.md
├── CHANGELOG.md
├── README.md
├── css/
│   └── styles.css
├── docs/
│   ├── arquitectura.md
│   ├── decisiones.md
│   ├── memoria.md
│   └── requerimientos.md
├── academico.html
├── comunicados.html
├── index.html
├── inicio.html
├── usuarios.html
└── js/
    ├── academico.js
    ├── comunicados.js
    └── app.js
```

## Alcance y seguridad

Este proyecto es una demostración académica. La autenticación es simulada y los datos son ficticios; no debe utilizarse con información real ni publicarse como sistema de producción. Consulte [requerimientos](docs/requerimientos.md) y [arquitectura](docs/arquitectura.md) para conocer límites y próximos pasos.

## Documentación

- [Requerimientos](docs/requerimientos.md)
- [Arquitectura](docs/arquitectura.md)
- [Decisiones técnicas](docs/decisiones.md)
- [Memoria del proyecto](docs/memoria.md)
- [Historial de cambios](CHANGELOG.md)

## Licencia

Proyecto educativo de demostración, 2026.

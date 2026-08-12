# Registro de decisiones técnicas

## ADR-001: stack sin frameworks

- **Estado:** aceptada
- **Fecha:** 2026-08-12
- **Contexto:** el proyecto solicita tecnologías vanilla y valora claridad sobre amplitud.
- **Decisión:** usar HTML, CSS y JavaScript nativo, sin dependencias ni compilación.
- **Consecuencia:** ejecución inmediata y código accesible para estudiantes; la organización deberá evolucionar si el sistema crece.

## ADR-002: aplicación de una sola página

- **Estado:** aceptada
- **Contexto:** los cuatro módulos comparten navegación y sesión simulada.
- **Decisión:** alternar secciones del documento sin recargar.
- **Consecuencia:** interacción rápida; no existen rutas enlazables ni historial por módulo.

## ADR-003: persistencia local

- **Estado:** aceptada solo para prototipo
- **Contexto:** se necesita demostrar creación y edición sin servidor.
- **Decisión:** almacenar usuarios, notas y comunicados en `localStorage`.
- **Consecuencia:** los datos sobreviven a recargas, pero no se comparten, sincronizan ni protegen como en producción.

## ADR-004: bajas lógicas

- **Estado:** aceptada
- **Contexto:** eliminar personas puede romper trazabilidad académica.
- **Decisión:** representar la baja mediante el campo `active`.
- **Consecuencia:** la información permanece disponible para auditoría y puede reactivarse.

## ADR-005: identidad visual sobria

- **Estado:** aceptada
- **Contexto:** una institución pública necesita claridad, confianza y accesibilidad.
- **Decisión:** usar verde profundo, fondos cálidos, naranja como acento y tipografía del sistema con títulos serif.
- **Consecuencia:** identidad diferenciada sin descargar recursos externos.

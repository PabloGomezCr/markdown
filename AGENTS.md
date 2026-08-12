# AGENTS.md

## Propósito del repositorio

Este repositorio contiene **Aula Clara**, un prototipo educativo de intranet escolar pública. Toda contribución debe mantener la solución comprensible, accesible y ejecutable sin un proceso de compilación.

## Reglas para agentes de IA

1. Leer `README.md` y `docs/requerimientos.md` antes de modificar comportamiento.
2. Mantener el stack vanilla: HTML semántico, CSS y JavaScript nativo.
3. No agregar datos personales reales, secretos ni credenciales.
4. Preservar la separación por roles y evitar exponer registros de otros estudiantes.
5. Documentar decisiones relevantes en `docs/decisiones.md`.
6. Registrar cambios visibles en `CHANGELOG.md` siguiendo *Keep a Changelog*.
7. Verificar navegación con teclado, etiquetas de formularios, contraste y diseño responsive.
8. No introducir dependencias salvo que exista una decisión documentada que las justifique.

## Convenciones

- Idioma de interfaz y documentación: español.
- Archivos: nombres en minúscula y `kebab-case`, excepto convenciones estándar.
- JavaScript: `const` por defecto, comillas simples y punto y coma.
- CSS: variables en `:root`, enfoque *mobile-aware* y estados de foco visibles.
- Commits: mensajes breves en imperativo, por ejemplo `Agrega filtro de usuarios`.

## Criterio de terminado

Una tarea se considera terminada cuando el flujo funciona en escritorio y móvil, no genera errores en consola, respeta el acceso por perfil, actualiza la documentación relacionada y queda registrada en el changelog.

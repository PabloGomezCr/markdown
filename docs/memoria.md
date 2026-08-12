# Memoria del proyecto

## Resumen

**Aula Clara** responde a la fragmentación habitual de la información escolar con un punto de acceso único para administración, docentes y familias. El alcance se concentró en cuatro flujos verificables: ingreso por perfil, administración de personas, seguimiento académico y comunicados.

## Plan de trabajo

1. Interpretar los requerimientos y delimitar el prototipo.
2. Definir perfiles, permisos y datos ficticios.
3. Diseñar una interfaz accesible y adaptable.
4. Implementar los módulos con tecnologías web nativas.
5. Documentar arquitectura, decisiones y criterios de aceptación.
6. Verificar sintaxis, enlaces, interacción y estado del repositorio.

## Resultado

El prototipo permite recorrer la experiencia de los tres perfiles desde una misma pantalla de acceso. Administración dispone del módulo de usuarios; docentes y administración pueden editar el área académica y publicar avisos; la familia recibe una vista individual limitada.

La persistencia local facilita una demostración funcional sin añadir infraestructura. Esta simplicidad fue intencional: el proyecto comunica claramente qué está resuelto y qué necesita una implementación productiva.

## Uso de Markdown

Markdown actúa como memoria operativa del proyecto:

- `README.md` orienta a cualquier persona que llega al repositorio.
- `docs/requerimientos.md` convierte el enunciado en requisitos trazables.
- `docs/arquitectura.md` explica componentes, datos y límites.
- `docs/decisiones.md` conserva el porqué de las decisiones.
- `CHANGELOG.md` registra la evolución del producto.
- `AGENTS.md` establece reglas para futuras contribuciones humanas o asistidas por IA.

Se emplean encabezados jerárquicos, listas, tablas, bloques de código, citas, enlaces y énfasis, procurando que cada documento también sea legible como texto plano.

## Riesgos y aprendizajes

| Riesgo | Mitigación actual | Evolución necesaria |
|---|---|---|
| Acceso a datos desde herramientas del navegador | Solo datos ficticios | API con autorización por recurso |
| Pérdida de cambios locales | Datos semilla disponibles | Base de datos y copias de seguridad |
| Confusión entre prototipo y producto real | Advertencias en documentación | Evaluación de seguridad y despliegue controlado |
| Crecimiento del JavaScript | Funciones por módulo | Separación en módulos y pruebas automatizadas |

## Próximos pasos

- Implementar servidor y base de datos.
- Integrar identidad institucional y permisos reales.
- Añadir auditoría de modificaciones académicas.
- Incorporar pruebas unitarias, de accesibilidad y de extremo a extremo.
- Validar los flujos con docentes, personal administrativo y familias.

## Conclusión

La entrega prioriza un alcance modesto, coherente y documentado. El resultado demuestra cómo Markdown puede conectar requerimientos, decisiones, ejecución y memoria, mientras el código ofrece una base visible sobre la cual discutir una futura intranet institucional.

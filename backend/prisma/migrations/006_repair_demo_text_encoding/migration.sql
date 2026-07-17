-- Use PostgreSQL Unicode escapes so demo text remains correct even in minimal
-- Alpine containers without an explicit UTF-8 locale.

WITH names(email, name) AS (
  VALUES
  ('demo.analyst@taskly.app', U&'Tom\00E1s Navarro'),
  ('demo.designer@taskly.app', U&'Luc\00EDa Herrera'),
  ('demo.lead@taskly.app', U&'Sof\00EDa Torres'),
  ('demo.marketing@taskly.app', U&'Nicol\00E1s Vega'),
  ('demo.ops@taskly.app', U&'Camila M\00E9ndez')
)
UPDATE "User" u SET name = n.name FROM names n WHERE u.email = n.email;

UPDATE "Organization" SET
  description = U&'Estudio digital multidisciplinario que coordina producto, marca y operaciones.'
WHERE slug = 'northstar-studio';
UPDATE "Organization" SET
  description = U&'Laboratorio de tecnolog\00EDa que desarrolla plataformas de datos, IA y seguridad.'
WHERE slug = 'vertex-labs';

WITH project_text(key, name, description) AS (
  VALUES
  ('NS-WEB', U&'Lanzamiento web corporativo', U&'Redise\00F1o y lanzamiento de la experiencia web internacional.'),
  ('NS-MOBILE', U&'Aplicaci\00F3n m\00F3vil de clientes', U&'MVP m\00F3vil para seguimiento de proyectos y aprobaciones.'),
  ('NS-BRAND', U&'Sistema de marca 2026', U&'Identidad, librer\00EDa visual y kit de comunicaci\00F3n comercial.'),
  ('NS-OPS', U&'Automatizaci\00F3n de operaciones', U&'Optimizaci\00F3n de intake, asignaci\00F3n y reportes de entrega.'),
  ('VX-AI', U&'Asistente inteligente', U&'Copiloto interno para b\00FAsqueda, resumen y soporte operativo.'),
  ('VX-DATA', U&'Plataforma de anal\00EDtica', U&'Pipeline y dashboards ejecutivos para decisiones en tiempo real.'),
  ('VX-SEC', U&'Programa de seguridad', U&'Hardening, controles de acceso y preparaci\00F3n para auditor\00EDa.'),
  ('VX-CLOUD', U&'Migraci\00F3n cloud', U&'Migraci\00F3n gradual de cargas cr\00EDticas con observabilidad y rollback.')
)
UPDATE "Project" p SET name = t.name, description = t.description, "updatedAt" = CURRENT_TIMESTAMP
FROM project_text t WHERE p.key = t.key;

WITH task_text(code, title, description) AS (
  VALUES
  ('DISC', U&'Definir alcance y criterios de \00E9xito', U&'Alinear objetivos, restricciones, m\00E9tricas y responsables con las partes interesadas.'),
  ('RESEARCH', U&'Completar investigaci\00F3n y an\00E1lisis', U&'Recopilar evidencia, riesgos, necesidades de usuario y referencias del mercado.'),
  ('PLAN', U&'Preparar plan de entrega', U&'Desglosar hitos, dependencias y capacidad disponible para el siguiente ciclo.'),
  ('DESIGN', U&'Validar propuesta de experiencia', U&'Revisar flujos, estados vac\00EDos, accesibilidad y consistencia visual.'),
  ('BUILD', U&'Implementar funcionalidad principal', U&'Construir el alcance priorizado con trazabilidad hacia los criterios de aceptaci\00F3n.'),
  ('QA', U&'Ejecutar pruebas funcionales', U&'Validar casos felices, errores, permisos y regresiones antes de liberar.'),
  ('CONTENT', U&'Preparar contenido y documentaci\00F3n', U&'Completar textos, gu\00EDas operativas y material de adopci\00F3n.'),
  ('SEC', U&'Revisar seguridad y privacidad', U&'Evaluar acceso, datos sensibles, dependencias y configuraciones del entorno.'),
  ('UAT', U&'Coordinar validaci\00F3n con stakeholders', U&'Realizar aceptaci\00F3n guiada, registrar observaciones y acordar el cierre.'),
  ('LAUNCH', U&'Ejecutar plan de lanzamiento', U&'Coordinar publicaci\00F3n, comunicaci\00F3n, soporte y criterios de rollback.'),
  ('METRICS', U&'Configurar m\00E9tricas de seguimiento', U&'Definir indicadores, fuentes, alertas y frecuencia de revisi\00F3n.'),
  ('RETRO', U&'Facilitar retrospectiva del proyecto', U&'Documentar resultados, aprendizajes y pr\00F3ximas mejoras.')
)
UPDATE "Task" task SET
  title = project.name || ' - ' || text.title,
  description = text.description,
  "updatedAt" = CURRENT_TIMESTAMP
FROM "Project" project, task_text text
WHERE task."demoKey" = project.key || '-' || text.code;

WITH subtask_text(code, title) AS (
  VALUES
  ('DESIGN-A11Y', U&'Revisar contraste y navegaci\00F3n por teclado'),
  ('BUILD-REVIEW', U&'Completar revisi\00F3n t\00E9cnica por pares')
)
UPDATE "Task" task SET
  title = project.name || ' - ' || text.title,
  description = U&'Subtarea demostrativa vinculada a un entregable principal.',
  "updatedAt" = CURRENT_TIMESTAMP
FROM "Project" project, subtask_text text
WHERE task."demoKey" = project.key || '-' || text.code;


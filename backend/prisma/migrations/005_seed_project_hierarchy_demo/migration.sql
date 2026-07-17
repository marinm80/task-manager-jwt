-- Taskly commercial demo dataset.
-- Safe to run repeatedly: all rows use reserved natural keys or Task.demoKey.
-- Shared local demo password: TasklyDemo2026!

INSERT INTO "User" ("email", "password", "name", "role", "isDemo", "createdAt") VALUES
('demo.admin@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Alex Morgan', 'ADMIN', true, CURRENT_TIMESTAMP - INTERVAL '180 days'),
('demo.owner@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Elena Campos', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '170 days'),
('demo.manager@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Mateo Silva', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '160 days'),
('demo.lead@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Sofía Torres', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '150 days'),
('demo.designer@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Lucía Herrera', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '140 days'),
('demo.developer@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Diego Rojas', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '130 days'),
('demo.qa@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Valentina Cruz', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '120 days'),
('demo.marketing@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Nicolás Vega', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '110 days'),
('demo.ops@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Camila Méndez', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '100 days'),
('demo.analyst@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Tomás Navarro', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '90 days'),
('demo.viewer@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Isabella Reed', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '80 days'),
('demo.client@taskly.app', '$2b$10$d/mctkYjncQPgfzsSWM2Cei5sHkiL9Uuv4cbtb.O9wHAyFKrFsLCq', 'Daniel Kim', 'USER', true, CURRENT_TIMESTAMP - INTERVAL '70 days')
ON CONFLICT ("email") DO UPDATE SET
  "password" = EXCLUDED."password",
  "name" = EXCLUDED."name",
  "role" = EXCLUDED."role",
  "isDemo" = true;

INSERT INTO "Organization" ("name", "slug", "description", "isDemo", "createdAt", "updatedAt") VALUES
('Northstar Studio', 'northstar-studio', 'Estudio digital multidisciplinario que coordina producto, marca y operaciones.', true, CURRENT_TIMESTAMP - INTERVAL '160 days', CURRENT_TIMESTAMP),
('Vertex Labs', 'vertex-labs', 'Laboratorio de tecnología que desarrolla plataformas de datos, IA y seguridad.', true, CURRENT_TIMESTAMP - INTERVAL '120 days', CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isDemo" = true,
  "updatedAt" = CURRENT_TIMESTAMP;

WITH memberships(email, slug, role) AS (
  VALUES
  ('demo.admin@taskly.app', 'northstar-studio', 'OWNER'::"OrganizationRole"),
  ('demo.owner@taskly.app', 'northstar-studio', 'OWNER'::"OrganizationRole"),
  ('demo.manager@taskly.app', 'northstar-studio', 'MANAGER'::"OrganizationRole"),
  ('demo.lead@taskly.app', 'northstar-studio', 'MEMBER'::"OrganizationRole"),
  ('demo.designer@taskly.app', 'northstar-studio', 'MEMBER'::"OrganizationRole"),
  ('demo.developer@taskly.app', 'northstar-studio', 'MEMBER'::"OrganizationRole"),
  ('demo.qa@taskly.app', 'northstar-studio', 'MEMBER'::"OrganizationRole"),
  ('demo.marketing@taskly.app', 'northstar-studio', 'MEMBER'::"OrganizationRole"),
  ('demo.viewer@taskly.app', 'northstar-studio', 'MEMBER'::"OrganizationRole"),
  ('demo.client@taskly.app', 'vertex-labs', 'OWNER'::"OrganizationRole"),
  ('demo.analyst@taskly.app', 'vertex-labs', 'MANAGER'::"OrganizationRole"),
  ('demo.developer@taskly.app', 'vertex-labs', 'MEMBER'::"OrganizationRole"),
  ('demo.qa@taskly.app', 'vertex-labs', 'MEMBER'::"OrganizationRole"),
  ('demo.ops@taskly.app', 'vertex-labs', 'MEMBER'::"OrganizationRole"),
  ('demo.lead@taskly.app', 'vertex-labs', 'MEMBER'::"OrganizationRole"),
  ('demo.viewer@taskly.app', 'vertex-labs', 'MEMBER'::"OrganizationRole")
)
INSERT INTO "OrganizationMember" ("organizationId", "userId", "role", "createdAt")
SELECT o.id, u.id, m.role, CURRENT_TIMESTAMP - INTERVAL '60 days'
FROM memberships m
JOIN "Organization" o ON o.slug = m.slug
JOIN "User" u ON u.email = m.email
ON CONFLICT ("organizationId", "userId") DO UPDATE SET "role" = EXCLUDED."role";

WITH projects(slug, key, name, description, status, start_days, due_days, creator_email) AS (
  VALUES
  ('northstar-studio', 'NS-WEB', 'Lanzamiento web corporativo', 'Rediseño y lanzamiento de la experiencia web internacional.', 'ACTIVE'::"ProjectStatus", -60, 25, 'demo.lead@taskly.app'),
  ('northstar-studio', 'NS-MOBILE', 'Aplicación móvil de clientes', 'MVP móvil para seguimiento de proyectos y aprobaciones.', 'PLANNING'::"ProjectStatus", 10, 90, 'demo.manager@taskly.app'),
  ('northstar-studio', 'NS-BRAND', 'Sistema de marca 2026', 'Identidad, librería visual y kit de comunicación comercial.', 'COMPLETED'::"ProjectStatus", -120, -15, 'demo.owner@taskly.app'),
  ('northstar-studio', 'NS-OPS', 'Automatización de operaciones', 'Optimización de intake, asignación y reportes de entrega.', 'ON_HOLD'::"ProjectStatus", -45, 45, 'demo.manager@taskly.app'),
  ('vertex-labs', 'VX-AI', 'Asistente inteligente', 'Copiloto interno para búsqueda, resumen y soporte operativo.', 'ACTIVE'::"ProjectStatus", -50, 40, 'demo.lead@taskly.app'),
  ('vertex-labs', 'VX-DATA', 'Plataforma de analítica', 'Pipeline y dashboards ejecutivos para decisiones en tiempo real.', 'ACTIVE'::"ProjectStatus", -80, 20, 'demo.analyst@taskly.app'),
  ('vertex-labs', 'VX-SEC', 'Programa de seguridad', 'Hardening, controles de acceso y preparación para auditoría.', 'PLANNING'::"ProjectStatus", 5, 75, 'demo.ops@taskly.app'),
  ('vertex-labs', 'VX-CLOUD', 'Migración cloud', 'Migración gradual de cargas críticas con observabilidad y rollback.', 'COMPLETED'::"ProjectStatus", -150, -30, 'demo.client@taskly.app')
)
INSERT INTO "Project" ("organizationId", "key", "name", "description", "status", "startDate", "dueDate", "createdById", "createdAt", "updatedAt")
SELECT o.id, p.key, p.name, p.description, p.status,
       CURRENT_TIMESTAMP + p.start_days * INTERVAL '1 day',
       CURRENT_TIMESTAMP + p.due_days * INTERVAL '1 day',
       u.id, CURRENT_TIMESTAMP - INTERVAL '65 days', CURRENT_TIMESTAMP
FROM projects p
JOIN "Organization" o ON o.slug = p.slug
JOIN "User" u ON u.email = p.creator_email
ON CONFLICT ("organizationId", "key") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "status" = EXCLUDED."status",
  "startDate" = EXCLUDED."startDate",
  "dueDate" = EXCLUDED."dueDate",
  "createdById" = EXCLUDED."createdById",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH project_members(project_key, email, role) AS (
  VALUES
  ('NS-WEB', 'demo.lead@taskly.app', 'LEAD'::"ProjectRole"),
  ('NS-WEB', 'demo.designer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-WEB', 'demo.developer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-WEB', 'demo.qa@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-WEB', 'demo.viewer@taskly.app', 'VIEWER'::"ProjectRole"),
  ('NS-MOBILE', 'demo.manager@taskly.app', 'LEAD'::"ProjectRole"),
  ('NS-MOBILE', 'demo.designer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-MOBILE', 'demo.developer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-MOBILE', 'demo.qa@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-BRAND', 'demo.owner@taskly.app', 'LEAD'::"ProjectRole"),
  ('NS-BRAND', 'demo.designer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-BRAND', 'demo.marketing@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-BRAND', 'demo.viewer@taskly.app', 'VIEWER'::"ProjectRole"),
  ('NS-OPS', 'demo.manager@taskly.app', 'LEAD'::"ProjectRole"),
  ('NS-OPS', 'demo.lead@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('NS-OPS', 'demo.qa@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-AI', 'demo.lead@taskly.app', 'LEAD'::"ProjectRole"),
  ('VX-AI', 'demo.developer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-AI', 'demo.analyst@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-AI', 'demo.viewer@taskly.app', 'VIEWER'::"ProjectRole"),
  ('VX-DATA', 'demo.analyst@taskly.app', 'LEAD'::"ProjectRole"),
  ('VX-DATA', 'demo.developer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-DATA', 'demo.qa@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-DATA', 'demo.client@taskly.app', 'VIEWER'::"ProjectRole"),
  ('VX-SEC', 'demo.ops@taskly.app', 'LEAD'::"ProjectRole"),
  ('VX-SEC', 'demo.developer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-SEC', 'demo.qa@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-SEC', 'demo.viewer@taskly.app', 'VIEWER'::"ProjectRole"),
  ('VX-CLOUD', 'demo.client@taskly.app', 'LEAD'::"ProjectRole"),
  ('VX-CLOUD', 'demo.ops@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-CLOUD', 'demo.developer@taskly.app', 'CONTRIBUTOR'::"ProjectRole"),
  ('VX-CLOUD', 'demo.viewer@taskly.app', 'VIEWER'::"ProjectRole")
)
INSERT INTO "ProjectMember" ("projectId", "userId", "role", "createdAt")
SELECT p.id, u.id, pm.role, CURRENT_TIMESTAMP - INTERVAL '55 days'
FROM project_members pm
JOIN "Project" p ON p.key = pm.project_key
JOIN "User" u ON u.email = pm.email
ON CONFLICT ("projectId", "userId") DO UPDATE SET "role" = EXCLUDED."role";

WITH templates(code, title, description, status, priority, due_days, assignee_slot) AS (
  VALUES
  ('DISC', 'Definir alcance y criterios de éxito', 'Alinear objetivos, restricciones, métricas y responsables con las partes interesadas.', 'COMPLETED'::"TaskStatus", 'HIGH'::"Priority", -35, 1),
  ('RESEARCH', 'Completar investigación y análisis', 'Recopilar evidencia, riesgos, necesidades de usuario y referencias del mercado.', 'COMPLETED'::"TaskStatus", 'MEDIUM'::"Priority", -28, 2),
  ('PLAN', 'Preparar plan de entrega', 'Desglosar hitos, dependencias y capacidad disponible para el siguiente ciclo.', 'COMPLETED'::"TaskStatus", 'HIGH'::"Priority", -21, 3),
  ('DESIGN', 'Validar propuesta de experiencia', 'Revisar flujos, estados vacíos, accesibilidad y consistencia visual.', 'IN_PROGRESS'::"TaskStatus", 'HIGH'::"Priority", -3, 2),
  ('BUILD', 'Implementar funcionalidad principal', 'Construir el alcance priorizado con trazabilidad hacia los criterios de aceptación.', 'IN_PROGRESS'::"TaskStatus", 'HIGH'::"Priority", 7, 3),
  ('QA', 'Ejecutar pruebas funcionales', 'Validar casos felices, errores, permisos y regresiones antes de liberar.', 'IN_PROGRESS'::"TaskStatus", 'MEDIUM'::"Priority", 10, 4),
  ('CONTENT', 'Preparar contenido y documentación', 'Completar textos, guías operativas y material de adopción.', 'PENDING'::"TaskStatus", 'MEDIUM'::"Priority", 14, 2),
  ('SEC', 'Revisar seguridad y privacidad', 'Evaluar acceso, datos sensibles, dependencias y configuraciones del entorno.', 'PENDING'::"TaskStatus", 'HIGH'::"Priority", 18, 3),
  ('UAT', 'Coordinar validación con stakeholders', 'Realizar aceptación guiada, registrar observaciones y acordar el cierre.', 'PENDING'::"TaskStatus", 'MEDIUM'::"Priority", 22, 1),
  ('LAUNCH', 'Ejecutar plan de lanzamiento', 'Coordinar publicación, comunicación, soporte y criterios de rollback.', 'PENDING'::"TaskStatus", 'HIGH'::"Priority", 28, 4),
  ('METRICS', 'Configurar métricas de seguimiento', 'Definir indicadores, fuentes, alertas y frecuencia de revisión.', 'PENDING'::"TaskStatus", 'LOW'::"Priority", 32, 2),
  ('RETRO', 'Facilitar retrospectiva del proyecto', 'Documentar resultados, aprendizajes y próximas mejoras.', 'PENDING'::"TaskStatus", 'LOW'::"Priority", 40, 3)
), demo_projects AS (
  SELECT p.* FROM "Project" p
  JOIN "Organization" o ON o.id = p."organizationId"
  WHERE o."isDemo" = true
), task_rows AS (
  SELECT
    p.id AS project_id,
    p."createdById" AS creator_id,
    p.key || '-' || t.code AS demo_key,
    p.name || ' · ' || t.title AS task_title,
    t.description,
    CASE WHEN p.status = 'COMPLETED' THEN 'COMPLETED'::"TaskStatus" ELSE t.status END AS task_status,
    t.priority,
    CASE WHEN p.status = 'COMPLETED'
      THEN CURRENT_TIMESTAMP - (ABS(t.due_days) + 15) * INTERVAL '1 day'
      ELSE CURRENT_TIMESTAMP + t.due_days * INTERVAL '1 day'
    END AS due_date,
    assignee."userId" AS assignee_id,
    t.assignee_slot
  FROM demo_projects p
  CROSS JOIN templates t
  CROSS JOIN LATERAL (
    SELECT ranked."userId"
    FROM (
      SELECT pm."userId", ROW_NUMBER() OVER (ORDER BY pm."userId") AS rn, COUNT(*) OVER () AS cnt
      FROM "ProjectMember" pm
      WHERE pm."projectId" = p.id AND pm.role <> 'VIEWER'
    ) ranked
    WHERE ranked.rn = MOD((t.assignee_slot - 1)::bigint, ranked.cnt) + 1
  ) assignee
)
INSERT INTO "Task" ("title", "description", "status", "priority", "dueDate", "userId", "projectId", "createdById", "demoKey", "createdAt", "updatedAt")
SELECT task_title, description, task_status, priority, due_date, assignee_id, project_id, creator_id, demo_key,
       CURRENT_TIMESTAMP - (20 - assignee_slot) * INTERVAL '1 day', CURRENT_TIMESTAMP
FROM task_rows
ON CONFLICT ("demoKey") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "status" = EXCLUDED."status",
  "priority" = EXCLUDED."priority",
  "dueDate" = EXCLUDED."dueDate",
  "userId" = EXCLUDED."userId",
  "projectId" = EXCLUDED."projectId",
  "createdById" = EXCLUDED."createdById",
  "updatedAt" = CURRENT_TIMESTAMP;

WITH subtask_templates(code, parent_code, title, status, day_offset) AS (
  VALUES
  ('DESIGN-A11Y', 'DESIGN', 'Revisar contraste y navegación por teclado', 'IN_PROGRESS'::"TaskStatus", 2),
  ('BUILD-REVIEW', 'BUILD', 'Completar revisión técnica por pares', 'PENDING'::"TaskStatus", 9)
), demo_projects AS (
  SELECT p.* FROM "Project" p
  JOIN "Organization" o ON o.id = p."organizationId"
  WHERE o."isDemo" = true
)
INSERT INTO "Task" ("title", "description", "status", "priority", "dueDate", "userId", "projectId", "createdById", "parentTaskId", "demoKey", "createdAt", "updatedAt")
SELECT p.name || ' · ' || s.title,
       'Subtarea demostrativa vinculada a un entregable principal.',
       CASE WHEN p.status = 'COMPLETED' THEN 'COMPLETED'::"TaskStatus" ELSE s.status END,
       'MEDIUM'::"Priority",
       CURRENT_TIMESTAMP + s.day_offset * INTERVAL '1 day',
       parent."userId", p.id, p."createdById", parent.id,
       p.key || '-' || s.code,
       CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP
FROM demo_projects p
CROSS JOIN subtask_templates s
JOIN "Task" parent ON parent."demoKey" = p.key || '-' || s.parent_code
ON CONFLICT ("demoKey") DO UPDATE SET
  "title" = EXCLUDED."title",
  "status" = EXCLUDED."status",
  "dueDate" = EXCLUDED."dueDate",
  "userId" = EXCLUDED."userId",
  "parentTaskId" = EXCLUDED."parentTaskId",
  "updatedAt" = CURRENT_TIMESTAMP;


-- Bulk seed: proyectos reales (no demo) para usuarios ya existentes en el
-- sistema, cada uno con tareas distribuidas simulando un ciclo normal de
-- trabajo (completadas en el pasado, en curso ahora, pendientes a futuro).
-- Idempotente: proyectos por (organizationId, key), tareas por "demoKey".

-- 1. Proyectos, uno por fila, resueltos contra la organización personal de
--    cada usuario (slug personal-<userId>) y creados por ese mismo usuario.
INSERT INTO "Project" ("organizationId", "name", "key", "description", "status", "createdById", "createdAt", "updatedAt")
SELECT o.id, p.name, p.key, p.description, p.status::"ProjectStatus", u.id, CURRENT_TIMESTAMP - INTERVAL '25 days', CURRENT_TIMESTAMP
FROM (VALUES
  ('euclidesm195@gmail.com', 'personal-1', 'Rediseño de Marca Personal', 'BRAND', 'Actualizar identidad visual y contenido del portafolio', 'ACTIVE'),
  ('euclidesm195@gmail.com', 'personal-1', 'Migración a Microservicios', 'MICRO', 'Separar el backend monolítico en servicios independientes', 'ACTIVE'),
  ('guest@taskly.com', 'personal-2', 'Plan de Marketing Q3', 'MKT-Q3', 'Campaña de adquisición del tercer trimestre', 'ACTIVE'),
  ('guest@taskly.com', 'personal-2', 'Onboarding de Clientes', 'ONBOARD', 'Rediseño del proceso de bienvenida a nuevos clientes', 'ACTIVE')
) AS p(email, org_slug, name, key, description, status)
JOIN "User" u ON u.email = p.email
JOIN "Organization" o ON o.slug = p.org_slug
ON CONFLICT ("organizationId", "key") DO NOTHING;

-- 2. El creador de cada proyecto queda como LEAD.
INSERT INTO "ProjectMember" ("projectId", "userId", "role", "createdAt")
SELECT pr.id, u.id, 'LEAD', CURRENT_TIMESTAMP
FROM (VALUES
  ('euclidesm195@gmail.com', 'personal-1', 'BRAND'),
  ('euclidesm195@gmail.com', 'personal-1', 'MICRO'),
  ('guest@taskly.com', 'personal-2', 'MKT-Q3'),
  ('guest@taskly.com', 'personal-2', 'ONBOARD')
) AS m(email, org_slug, key)
JOIN "User" u ON u.email = m.email
JOIN "Organization" o ON o.slug = m.org_slug
JOIN "Project" pr ON pr."organizationId" = o.id AND pr.key = m.key
ON CONFLICT ("projectId", "userId") DO NOTHING;

-- 3. Tareas por proyecto: mezcla de COMPLETED (pasado), IN_PROGRESS (ahora)
--    y PENDING (a futuro) para que cada tablero se vea como trabajo real.
INSERT INTO "Task" ("title", "description", "status", "priority", "dueDate", "userId", "projectId", "createdById", "demoKey", "createdAt", "updatedAt")
SELECT t.title, t.description, t.status::"TaskStatus", t.priority::"Priority",
       CURRENT_TIMESTAMP + t.due_offset * INTERVAL '1 day',
       u.id, pr.id, u.id, t.demo_key,
       CURRENT_TIMESTAMP + t.created_offset * INTERVAL '1 day', CURRENT_TIMESTAMP
FROM (VALUES
  -- BRAND (Euclides)
  ('BRAND', 'Auditoría de marca actual', 'Revisar consistencia visual en todos los canales', 'COMPLETED', 'HIGH', -25, -10, 'ruprj-brand-01'),
  ('BRAND', 'Definir paleta de colores y tipografía', 'Documentar guía de estilo actualizada', 'COMPLETED', 'MEDIUM', -20, -7, 'ruprj-brand-02'),
  ('BRAND', 'Rediseñar logo y favicon', 'Nueva versión simplificada para web y redes', 'COMPLETED', 'HIGH', -15, -3, 'ruprj-brand-03'),
  ('BRAND', 'Actualizar sección "Sobre mí" del portafolio', 'Reescribir copy con enfoque en resultados', 'IN_PROGRESS', 'MEDIUM', -14, 2, 'ruprj-brand-04'),
  ('BRAND', 'Crear plantilla de presentación para clientes', 'Deck reutilizable para propuestas comerciales', 'IN_PROGRESS', 'MEDIUM', -10, 4, 'ruprj-brand-05'),
  ('BRAND', 'Optimizar imágenes del hero para web', 'Comprimir y servir en WebP', 'IN_PROGRESS', 'LOW', -7, 6, 'ruprj-brand-06'),
  ('BRAND', 'Escribir 3 casos de estudio nuevos', 'Incluir métricas de impacto por proyecto', 'IN_PROGRESS', 'HIGH', -5, 8, 'ruprj-brand-07'),
  ('BRAND', 'Grabar video de introducción', 'Clip corto para la landing page', 'PENDING', 'MEDIUM', -3, 12, 'ruprj-brand-08'),
  ('BRAND', 'Configurar analítica de visitas', 'Dashboard simple de tráfico y conversiones', 'PENDING', 'LOW', -1, 18, 'ruprj-brand-09'),
  ('BRAND', 'Publicar en directorios de freelancers', 'Actualizar perfiles con el nuevo branding', 'PENDING', 'LOW', 0, 25, 'ruprj-brand-10'),

  -- MICRO (Euclides)
  ('MICRO', 'Documentar arquitectura monolito actual', 'Diagrama de dependencias entre módulos', 'COMPLETED', 'HIGH', -25, -12, 'ruprj-micro-01'),
  ('MICRO', 'Elegir stack de mensajería', 'Comparar RabbitMQ vs Kafka para el caso de uso', 'COMPLETED', 'HIGH', -21, -9, 'ruprj-micro-02'),
  ('MICRO', 'Prototipo de servicio de autenticación aislado', 'Validar viabilidad antes de migrar producción', 'COMPLETED', 'HIGH', -17, -4, 'ruprj-micro-03'),
  ('MICRO', 'Extraer servicio de notificaciones', 'Primer servicio candidato por bajo acoplamiento', 'IN_PROGRESS', 'MEDIUM', -13, 3, 'ruprj-micro-04'),
  ('MICRO', 'Configurar API Gateway', 'Enrutamiento y rate limiting centralizado', 'IN_PROGRESS', 'HIGH', -9, 5, 'ruprj-micro-05'),
  ('MICRO', 'Definir contratos de eventos entre servicios', 'Esquemas versionados para evitar breaking changes', 'IN_PROGRESS', 'MEDIUM', -6, 7, 'ruprj-micro-06'),
  ('MICRO', 'Migrar tabla de usuarios al nuevo servicio', 'Incluye script de sincronización dual-write', 'IN_PROGRESS', 'HIGH', -4, 9, 'ruprj-micro-07'),
  ('MICRO', 'Pruebas de carga del gateway', 'Simular tráfico pico de producción', 'PENDING', 'MEDIUM', -2, 14, 'ruprj-micro-08'),
  ('MICRO', 'Plan de rollback por servicio', 'Procedimiento documentado si algo falla en producción', 'PENDING', 'HIGH', -1, 20, 'ruprj-micro-09'),
  ('MICRO', 'Documentar runbooks de despliegue', 'Guía paso a paso para el equipo de operaciones', 'PENDING', 'LOW', 0, 28, 'ruprj-micro-10'),

  -- MKT-Q3 (Guest)
  ('MKT-Q3', 'Analizar resultados de campaña Q2', 'Identificar canales con mejor retorno', 'COMPLETED', 'HIGH', -24, -11, 'ruprj-mktq3-01'),
  ('MKT-Q3', 'Definir público objetivo del trimestre', 'Actualizar buyer personas con datos recientes', 'COMPLETED', 'MEDIUM', -19, -8, 'ruprj-mktq3-02'),
  ('MKT-Q3', 'Aprobar presupuesto de medios pagados', 'Distribución por canal aprobada por finanzas', 'COMPLETED', 'HIGH', -16, -5, 'ruprj-mktq3-03'),
  ('MKT-Q3', 'Calendario editorial de redes sociales', 'Planificación de contenido para 12 semanas', 'IN_PROGRESS', 'MEDIUM', -12, 2, 'ruprj-mktq3-04'),
  ('MKT-Q3', 'Diseñar creativos para campaña de verano', 'Piezas para display y redes sociales', 'IN_PROGRESS', 'MEDIUM', -8, 4, 'ruprj-mktq3-05'),
  ('MKT-Q3', 'Coordinar colaboración con influencers', 'Negociar 3 colaboraciones para el trimestre', 'IN_PROGRESS', 'LOW', -5, 6, 'ruprj-mktq3-06'),
  ('MKT-Q3', 'Configurar tracking UTM en landing pages', 'Asegurar atribución correcta por campaña', 'IN_PROGRESS', 'MEDIUM', -3, 7, 'ruprj-mktq3-07'),
  ('MKT-Q3', 'Lanzar campaña en redes', 'Publicación coordinada en todos los canales', 'PENDING', 'HIGH', -1, 15, 'ruprj-mktq3-08'),
  ('MKT-Q3', 'Revisar métricas a mitad de trimestre', 'Checkpoint de performance y ajustes', 'PENDING', 'MEDIUM', 0, 22, 'ruprj-mktq3-09'),
  ('MKT-Q3', 'Preparar reporte final de Q3', 'Resumen ejecutivo con aprendizajes clave', 'PENDING', 'LOW', 0, 30, 'ruprj-mktq3-10'),

  -- ONBOARD (Guest)
  ('ONBOARD', 'Mapear pasos actuales del onboarding', 'Documentar el flujo tal como existe hoy', 'COMPLETED', 'MEDIUM', -23, -10, 'ruprj-onboard-01'),
  ('ONBOARD', 'Entrevistar a 5 clientes recientes', 'Identificar puntos de fricción reales', 'COMPLETED', 'HIGH', -18, -6, 'ruprj-onboard-02'),
  ('ONBOARD', 'Rediseñar email de bienvenida', 'Tono más cercano y pasos más claros', 'COMPLETED', 'MEDIUM', -14, -3, 'ruprj-onboard-03'),
  ('ONBOARD', 'Crear checklist interactivo para nuevos clientes', 'Guía paso a paso dentro del producto', 'IN_PROGRESS', 'HIGH', -11, 3, 'ruprj-onboard-04'),
  ('ONBOARD', 'Grabar video tutorial de primeros pasos', 'Menos de 3 minutos, enfocado en el primer login', 'IN_PROGRESS', 'MEDIUM', -7, 5, 'ruprj-onboard-05'),
  ('ONBOARD', 'Configurar recordatorios automáticos', 'Email a los 3 y 7 días sin actividad', 'IN_PROGRESS', 'LOW', -4, 6, 'ruprj-onboard-06'),
  ('ONBOARD', 'Definir métricas de éxito del onboarding', 'Tiempo a primer valor y tasa de activación', 'IN_PROGRESS', 'MEDIUM', -2, 8, 'ruprj-onboard-07'),
  ('ONBOARD', 'Piloto con 3 clientes nuevos', 'Probar el flujo rediseñado antes de escalar', 'PENDING', 'HIGH', -1, 16, 'ruprj-onboard-08'),
  ('ONBOARD', 'Ajustar flujo según feedback del piloto', 'Iterar antes del lanzamiento general', 'PENDING', 'MEDIUM', 0, 23, 'ruprj-onboard-09'),
  ('ONBOARD', 'Documentar proceso final para el equipo', 'Runbook interno de soporte al cliente', 'PENDING', 'LOW', 0, 30, 'ruprj-onboard-10')
) AS t(project_key, title, description, status, priority, created_offset, due_offset, demo_key)
JOIN "Project" pr ON pr.key = t.project_key
JOIN "User" u ON u.id = pr."createdById"
ON CONFLICT ("demoKey") DO UPDATE SET
  "title" = EXCLUDED."title",
  "description" = EXCLUDED."description",
  "status" = EXCLUDED."status",
  "priority" = EXCLUDED."priority",
  "dueDate" = EXCLUDED."dueDate",
  "updatedAt" = CURRENT_TIMESTAMP;

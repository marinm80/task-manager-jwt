const prisma = require('../config/db');
const { projectSchema } = require('../schemas/projectSchemas');
const { hasMinimumRole, ORGANIZATION_RANK } = require('../services/permissionService');

const getMembership = async (organizationId, userId) =>
  prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });

// Cada usuario necesita al menos un espacio propio para crear proyectos sin
// tener que entender el concepto de "organización" (no hay UI para crearlas
// a mano). El slug es determinístico por userId, así que esto es idempotente:
// se reintenta en cada login/getOrganizations sin duplicar nada.
const ensurePersonalOrganization = async (user) => {
  const slug = `personal-${user.id}`;
  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) return existing;
  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: `Proyectos de ${user.name}`, slug, description: 'Espacio personal' },
    });
    await tx.organizationMember.create({
      data: { organizationId: organization.id, userId: user.id, role: 'OWNER' },
    });
    return organization;
  });
};

const getOrganizations = async (req, res, next) => {
  try {
    await ensurePersonalOrganization(req.user);
    const organizations = await prisma.organization.findMany({
      where: req.user.role === 'ADMIN' ? {} : { members: { some: { userId: req.user.id } } },
      include: {
        members: {
          where: { userId: req.user.id },
          select: { role: true },
        },
        _count: { select: { members: true, projects: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(organizations.map(({ members, ...organization }) => ({
      ...organization,
      effectiveRole: req.user.role === 'ADMIN' ? (members[0]?.role ?? 'ADMIN') : members[0]?.role,
    })));
  } catch (error) {
    next(error);
  }
};

const getOrganizationMembers = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const membership = await getMembership(organizationId, req.user.id);
    if (req.user.role !== 'ADMIN' && !membership) return res.status(403).json({ message: 'Forbidden' });

    const members = await prisma.organizationMember.findMany({
      where: { organizationId },
      include: { user: { select: { id: true, name: true, email: true, role: true, isDemo: true } } },
      orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

const getOrganizationProjects = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const membership = await getMembership(organizationId, req.user.id);
    if (req.user.role !== 'ADMIN' && !membership) return res.status(403).json({ message: 'Forbidden' });

    const canSeeAll = req.user.role === 'ADMIN' ||
      hasMinimumRole(ORGANIZATION_RANK, membership?.role, 'MANAGER');
    const projects = await prisma.project.findMany({
      where: {
        organizationId,
        ...(canSeeAll ? {} : { members: { some: { userId: req.user.id } } }),
      },
      include: {
        createdBy: { select: { id: true, name: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { tasks: true } },
      },
      orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const organizationId = Number(req.params.organizationId);
    const membership = await getMembership(organizationId, req.user.id);
    const allowed = req.user.role === 'ADMIN' || hasMinimumRole(ORGANIZATION_RANK, membership?.role, 'MANAGER');
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });

    const data = projectSchema.parse(req.body);
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          ...data,
          organizationId,
          createdById: req.user.id,
          startDate: data.startDate ? new Date(data.startDate) : null,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
      });
      await tx.projectMember.create({ data: { projectId: created.id, userId: req.user.id, role: 'LEAD' } });
      return created;
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizations,
  getOrganizationMembers,
  getOrganizationProjects,
  createProject,
};


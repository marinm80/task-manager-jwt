const prisma = require('../config/db');
const {
  updateProjectSchema,
  projectTaskSchema,
  updateProjectTaskSchema,
  projectMemberSchema,
} = require('../schemas/projectSchemas');
const { getProjectContext, canModifyTask } = require('../services/permissionService');

const projectInclude = {
  organization: { select: { id: true, name: true, slug: true } },
  createdBy: { select: { id: true, name: true } },
  members: { include: { user: { select: { id: true, name: true, email: true, isDemo: true } } } },
  _count: { select: { tasks: true } },
};

const loadContext = async (req, res) => {
  const context = await getProjectContext(req.user, Number(req.params.projectId));
  if (!context) {
    res.status(404).json({ message: 'Project not found' });
    return null;
  }
  return context;
};

// Lista plana de proyectos del usuario (todas sus organizaciones a la vez),
// usada por el selector "Proyecto" del formulario de tareas personales —
// a diferencia de getOrganizationProjects (projectController hermano en
// organizationController.js), no requiere elegir una organización primero.
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: req.user.role === 'ADMIN' ? {} : { members: { some: { userId: req.user.id } } },
      select: { id: true, name: true, key: true, organizationId: true },
      orderBy: { name: 'asc' },
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    if (!context.capabilities.readProject) return res.status(403).json({ message: 'Forbidden' });
    const project = await prisma.project.findUnique({ where: { id: context.project.id }, include: projectInclude });
    res.json({ ...project, permissions: context.capabilities });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    if (!context.capabilities.manageProject) return res.status(403).json({ message: 'Forbidden' });
    const data = updateProjectSchema.parse(req.body);
    if (Object.prototype.hasOwnProperty.call(data, 'startDate')) data.startDate = data.startDate ? new Date(data.startDate) : null;
    if (Object.prototype.hasOwnProperty.call(data, 'dueDate')) data.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    const project = await prisma.project.update({ where: { id: context.project.id }, data, include: projectInclude });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

const getProjectMembers = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    if (!context.capabilities.readProject) return res.status(403).json({ message: 'Forbidden' });
    const members = await prisma.projectMember.findMany({
      where: { projectId: context.project.id },
      include: { user: { select: { id: true, name: true, email: true, isDemo: true } } },
      orderBy: [{ role: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(members);
  } catch (error) {
    next(error);
  }
};

const upsertProjectMember = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    if (!context.capabilities.manageProjectMembers) return res.status(403).json({ message: 'Forbidden' });
    const data = projectMemberSchema.parse(req.body);
    const organizationMember = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: context.project.organizationId, userId: data.userId } },
    });
    if (!organizationMember) return res.status(400).json({ message: 'User must belong to the organization' });
    const member = await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId: context.project.id, userId: data.userId } },
      create: { projectId: context.project.id, ...data },
      update: { role: data.role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json(member);
  } catch (error) {
    next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    if (!context.capabilities.readTasks) return res.status(403).json({ message: 'Forbidden' });
    const where = { projectId: context.project.id };
    if (req.query.status) where.status = req.query.status;
    if (req.query.priority) where.priority = req.query.priority;
    if (req.query.userId) where.userId = Number(req.query.userId);
    const tasks = await prisma.task.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        subtasks: { select: { id: true, title: true, status: true } },
      },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { dueDate: 'asc' }],
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const validateAssignment = async (projectId, userId, parentTaskId) => {
  if (userId) {
    const member = await prisma.projectMember.findUnique({ where: { projectId_userId: { projectId, userId } } });
    if (!member) return 'Assignee must belong to the project';
  }
  if (parentTaskId) {
    const parent = await prisma.task.findUnique({ where: { id: parentTaskId } });
    if (!parent || parent.projectId !== projectId || parent.parentTaskId) return 'Invalid parent task';
  }
  return null;
};

const createProjectTask = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    if (!context.capabilities.createTasks) return res.status(403).json({ message: 'Forbidden' });
    const data = projectTaskSchema.parse(req.body);
    const assignmentError = await validateAssignment(context.project.id, data.userId, data.parentTaskId);
    if (assignmentError) return res.status(400).json({ message: assignmentError });
    const task = await prisma.task.create({
      data: {
        ...data,
        projectId: context.project.id,
        createdById: req.user.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const updateProjectTask = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    const taskId = Number(req.params.taskId);
    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing || existing.projectId !== context.project.id) return res.status(404).json({ message: 'Task not found' });
    if (!canModifyTask({ capabilities: context.capabilities, userId: req.user.id, task: existing })) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const data = updateProjectTaskSchema.parse(req.body);
    const assignmentError = await validateAssignment(context.project.id, data.userId, data.parentTaskId);
    if (assignmentError) return res.status(400).json({ message: assignmentError });
    if (Object.prototype.hasOwnProperty.call(data, 'dueDate')) data.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    const task = await prisma.task.update({ where: { id: taskId }, data });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteProjectTask = async (req, res, next) => {
  try {
    const context = await loadContext(req, res);
    if (!context) return;
    const taskId = Number(req.params.taskId);
    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing || existing.projectId !== context.project.id) return res.status(404).json({ message: 'Task not found' });
    if (!canModifyTask({ capabilities: context.capabilities, userId: req.user.id, task: existing })) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProjects,
  getProject,
  updateProject,
  getProjectMembers,
  upsertProjectMember,
  getProjectTasks,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
};


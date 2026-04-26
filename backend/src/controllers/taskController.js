const prisma = require('../config/db');
const { createTaskSchema, updateTaskSchema } = require('../schemas/taskSchemas');
const { exportTasksToCSV } = require('../utils/csvExporter');

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, page = '1', limit = '10' } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);
    res.json({ tasks, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const task = await prisma.task.create({ data: { ...data, userId: req.user.id } });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Task not found' });
    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Forbidden' });
    const data = updateTaskSchema.parse(req.body);
    if (data.dueDate) data.dueDate = new Date(data.dueDate);
    const task = await prisma.task.update({ where: { id }, data });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Task not found' });
    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ message: 'Forbidden' });
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.user.id } });
    const csv = exportTasksToCSV(tasks);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, exportCSV };

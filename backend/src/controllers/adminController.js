const bcrypt = require('bcrypt');
const { z } = require('zod');
const prisma = require('../config/db');

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(100),
});

const USER_SELECT = { id: true, name: true, email: true, role: true, createdAt: true };

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getUserTasks = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed, role: data.role ?? 'USER' },
      select: USER_SELECT,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const data = updateUserSchema.parse(req.body);
    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== userId) return res.status(409).json({ message: 'Email already registered' });
    }
    const user = await prisma.user.update({ where: { id: userId }, data, select: USER_SELECT });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Project.createdBy usa onDelete: Restrict a propósito (para no borrar
// proyectos en cascada solo por eliminar a quien los creó) — así que si el
// usuario ya creó proyectos, hay que pedir reasignarlos/borrarlos primero
// en vez de dejar que la FK truene con un error crudo de Postgres.
const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }
    const projectCount = await prisma.project.count({ where: { createdById: userId } });
    if (projectCount > 0) {
      return res.status(400).json({
        message: 'Este usuario creó proyectos; reasígnalos o elimínalos antes de borrar la cuenta',
      });
    }
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// A diferencia de authController.changePassword (self-service, exige la
// contraseña actual), esto es para cuando el admin resetea la cuenta de
// alguien más — no tiene forma de conocer la contraseña actual, así que no
// se le pide. Igual invalida el refreshToken del usuario objetivo para que
// cualquier sesión ya abierta con la contraseña vieja quede cortada.
const resetUserPassword = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = resetPasswordSchema.parse(req.body);
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed, refreshToken: null },
    });
    res.json({ message: 'Password reset' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserTasks,
  updateUserRole,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
};

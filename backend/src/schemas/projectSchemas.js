const { z } = require('zod');

const projectStatus = z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED']);
const projectRole = z.enum(['LEAD', 'CONTRIBUTOR', 'VIEWER']);

const projectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  key: z.string().trim().min(2).max(12).regex(/^[A-Za-z0-9-]+$/).transform((value) => value.toUpperCase()),
  description: z.string().trim().max(1000).optional().nullable(),
  status: projectStatus.optional(),
  startDate: z.string().datetime().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
});

const updateProjectSchema = projectSchema.partial();

const projectTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  userId: z.number().int().positive().optional().nullable(),
  parentTaskId: z.number().int().positive().optional().nullable(),
});

const updateProjectTaskSchema = projectTaskSchema.partial();
const projectMemberSchema = z.object({ userId: z.number().int().positive(), role: projectRole });

module.exports = {
  projectSchema,
  updateProjectSchema,
  projectTaskSchema,
  updateProjectTaskSchema,
  projectMemberSchema,
};


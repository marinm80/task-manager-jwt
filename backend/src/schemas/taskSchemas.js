const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional().nullable(),
  projectId: z.number().int().positive().optional().nullable(),
});

const updateTaskSchema = createTaskSchema.partial();

module.exports = { createTaskSchema, updateTaskSchema };

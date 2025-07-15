import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  first_name: z
    .string()
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  last_name: z
    .string()
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .optional(),
  first_name: z
    .string()
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  last_name: z
    .string()
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  is_active: z.boolean().optional(),
});

export const userIdSchema = z.object({
  id: z.coerce.number(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdInput = z.infer<typeof userIdSchema>;

import express, { Request, Response } from 'express';
import { UserModel, CreateUserData } from './users.model';
import { validateBody, validateParams } from '../middleware/validation';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from './users.schemas';

const router = express.Router();
const userModel = new UserModel();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username
 *         first_name:
 *           type: string
 *           description: The user's first name
 *         last_name:
 *           type: string
 *           description: The user's last name
 *         is_active:
 *           type: boolean
 *           description: Whether the user is active
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the user was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated
 *     CreateUser:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *         first_name:
 *           type: string
 *           description: The user's first name
 *         last_name:
 *           type: string
 *           description: The user's last name
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: Validation failed
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userModel.findAll();
    const safeUsers = users.map(({ password_hash, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  validateParams(userIdSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(Number(id));

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const { password_hash, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  validateBody(createUserSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, username, password, first_name, last_name } = req.body;

      const existingUserByEmail = await userModel.findByEmail(email);
      if (existingUserByEmail) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      const existingUserByUsername = await userModel.findByUsername(username);
      if (existingUserByUsername) {
        res
          .status(409)
          .json({ error: 'User with this username already exists' });
        return;
      }

      const userData: CreateUserData = {
        email,
        username,
        password_hash: password,
        first_name,
        last_name,
      };

      const user = await userModel.create(userData);
      const { password_hash, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found
 *       409:
 *         description: Email or username already exists
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { email, username, first_name, last_name, is_active } = req.body;

      const existingUser = await userModel.findById(Number(id));
      if (!existingUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (email && email !== existingUser.email) {
        const userWithEmail = await userModel.findByEmail(email);
        if (userWithEmail) {
          res
            .status(409)
            .json({ error: 'User with this email already exists' });
          return;
        }
      }

      if (username && username !== existingUser.username) {
        const userWithUsername = await userModel.findByUsername(username);
        if (userWithUsername) {
          res
            .status(409)
            .json({ error: 'User with this username already exists' });
          return;
        }
      }

      const updates: any = {};
      if (email !== undefined) updates.email = email;
      if (username !== undefined) updates.username = username;
      if (first_name !== undefined) updates.first_name = first_name;
      if (last_name !== undefined) updates.last_name = last_name;
      if (is_active !== undefined) updates.is_active = is_active;

      const updatedUser = await userModel.update(Number(id), updates);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const { password_hash, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  validateParams(userIdSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await userModel.delete(Number(id));

      if (!deleted) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;

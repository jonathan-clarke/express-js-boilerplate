import request from 'supertest';
import app from '../app';
import { Database } from '../database';

// Mock the entire database module
jest.mock('../database', () => {
  const mockDatabase = {
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    close: jest.fn(),
  };

  return {
    Database: {
      getInstance: jest.fn(() => mockDatabase),
    },
  };
});

// Get the mocked database instance
const mockDatabase = (Database.getInstance as jest.Mock)();

// Mock data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  username: 'testuser',
  password_hash: 'hashedpassword',
  first_name: 'Test',
  last_name: 'User',
  is_active: 1,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
};

const mockUsers = [
  mockUser,
  {
    id: 2,
    email: 'test2@example.com',
    username: 'testuser2',
    password_hash: 'hashedpassword2',
    first_name: 'Test2',
    last_name: 'User2',
    is_active: 1,
    created_at: '2023-01-01T00:00:00.000Z',
    updated_at: '2023-01-01T00:00:00.000Z',
  },
];

describe('User CRUD Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users without password_hash', async () => {
      mockDatabase.all.mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).not.toHaveProperty('password_hash');
      expect(response.body[0]).toMatchObject({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
      });
      expect(mockDatabase.all).toHaveBeenCalledWith(
        'SELECT * FROM users ORDER BY created_at DESC'
      );
    });

    it('should handle database errors', async () => {
      mockDatabase.all.mockRejectedValue(new Error('Database error'));

      await request(app)
        .get('/api/users')
        .expect(500)
        .expect((res) => {
          expect(res.body.error).toBe('Internal server error');
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id without password_hash', async () => {
      mockDatabase.get.mockResolvedValue(mockUser);

      const response = await request(app).get('/api/users/1').expect(200);

      expect(response.body).not.toHaveProperty('password_hash');
      expect(response.body).toMatchObject({
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
      });
      expect(mockDatabase.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1]
      );
    });

    it('should return 404 if user not found', async () => {
      mockDatabase.get.mockResolvedValue(null);

      await request(app)
        .get('/api/users/999')
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('User not found');
        });
    });

    it('should return 400 for invalid user id', async () => {
      await request(app)
        .get('/api/users/invalid')
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Invalid parameters');
        });
    });

    it('should handle database errors', async () => {
      mockDatabase.get.mockRejectedValue(new Error('Database error'));

      await request(app)
        .get('/api/users/1')
        .expect(500)
        .expect((res) => {
          expect(res.body.error).toBe('Internal server error');
        });
    });
  });

  describe('POST /api/users', () => {
    const validUserData = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
      first_name: 'New',
      last_name: 'User',
    };

    it('should create a new user successfully', async () => {
      // Mock checks for existing email and username
      mockDatabase.get
        .mockResolvedValueOnce(null) // findByEmail
        .mockResolvedValueOnce(null) // findByUsername
        .mockResolvedValueOnce({
          // findById after create
          ...mockUser,
          id: 3,
          email: validUserData.email,
          username: validUserData.username,
        });

      // Mock the insert operation
      mockDatabase.run.mockResolvedValue({ lastID: 3, changes: 1 });

      const response = await request(app)
        .post('/api/users')
        .send(validUserData)
        .expect(201);

      expect(response.body).not.toHaveProperty('password_hash');
      expect(response.body.email).toBe(validUserData.email);
      expect(response.body.username).toBe(validUserData.username);

      expect(mockDatabase.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        [validUserData.email]
      );
      expect(mockDatabase.get).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = ?',
        [validUserData.username]
      );
      expect(mockDatabase.run).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [
          validUserData.email,
          validUserData.username,
          validUserData.password,
          validUserData.first_name,
          validUserData.last_name,
        ]
      );
    });

    it('should return 400 for missing required fields', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com' })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Validation failed');
          expect(res.body.details).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ field: 'username' }),
              expect.objectContaining({ field: 'password' }),
            ])
          );
        });
    });

    it('should return 400 for invalid email format', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          username: 'testuser',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Validation failed');
        });
    });

    it('should return 400 for short username', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          username: 'ab',
          password: 'password123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Validation failed');
        });
    });

    it('should return 400 for short password', async () => {
      await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: '123',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Validation failed');
        });
    });

    it('should return 409 if email already exists', async () => {
      mockDatabase.get.mockResolvedValueOnce(mockUser); // findByEmail returns existing user

      await request(app)
        .post('/api/users')
        .send(validUserData)
        .expect(409)
        .expect((res) => {
          expect(res.body.error).toBe('User with this email already exists');
        });
    });

    it('should return 409 if username already exists', async () => {
      mockDatabase.get
        .mockResolvedValueOnce(null) // findByEmail
        .mockResolvedValueOnce(mockUser); // findByUsername returns existing user

      await request(app)
        .post('/api/users')
        .send(validUserData)
        .expect(409)
        .expect((res) => {
          expect(res.body.error).toBe('User with this username already exists');
        });
    });

    it('should handle database errors', async () => {
      mockDatabase.get.mockRejectedValue(new Error('Database error'));

      await request(app)
        .post('/api/users')
        .send(validUserData)
        .expect(500)
        .expect((res) => {
          expect(res.body.error).toBe('Internal server error');
        });
    });
  });

  describe('PUT /api/users/:id', () => {
    const updateData = {
      email: 'updated@example.com',
      first_name: 'Updated',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateData };

      mockDatabase.get
        .mockResolvedValueOnce(mockUser) // findById - existing user
        .mockResolvedValueOnce(null) // findByEmail - no conflict
        .mockResolvedValueOnce(updatedUser); // findById after update

      mockDatabase.run.mockResolvedValue({ changes: 1 });

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);

      expect(response.body).not.toHaveProperty('password_hash');
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.first_name).toBe(updateData.first_name);

      expect(mockDatabase.run).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        expect.arrayContaining([updateData.email, updateData.first_name, 1])
      );
    });

    it('should return 404 if user not found', async () => {
      mockDatabase.get.mockResolvedValue(null);

      await request(app)
        .put('/api/users/999')
        .send(updateData)
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('User not found');
        });
    });

    it('should return 400 for invalid user id', async () => {
      await request(app)
        .put('/api/users/invalid')
        .send(updateData)
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Invalid parameters');
        });
    });

    it('should return 409 if email already exists for another user', async () => {
      const otherUser = { ...mockUser, id: 2 };
      mockDatabase.get
        .mockResolvedValueOnce(mockUser) // findById - existing user
        .mockResolvedValueOnce(otherUser); // findByEmail - conflict

      await request(app)
        .put('/api/users/1')
        .send({ email: 'taken@example.com' })
        .expect(409)
        .expect((res) => {
          expect(res.body.error).toBe('User with this email already exists');
        });
    });

    it('should handle validation errors', async () => {
      await request(app)
        .put('/api/users/1')
        .send({ email: 'invalid-email' })
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Validation failed');
        });
    });

    it('should handle database errors', async () => {
      mockDatabase.get.mockRejectedValue(new Error('Database error'));

      await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(500)
        .expect((res) => {
          expect(res.body.error).toBe('Internal server error');
        });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      mockDatabase.run.mockResolvedValue({ changes: 1 });

      await request(app).delete('/api/users/1').expect(204);

      expect(mockDatabase.run).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = ?',
        [1]
      );
    });

    it('should return 404 if user not found', async () => {
      mockDatabase.run.mockResolvedValue({ changes: 0 });

      await request(app)
        .delete('/api/users/999')
        .expect(404)
        .expect((res) => {
          expect(res.body.error).toBe('User not found');
        });
    });

    it('should return 400 for invalid user id', async () => {
      await request(app)
        .delete('/api/users/invalid')
        .expect(400)
        .expect((res) => {
          expect(res.body.error).toBe('Invalid parameters');
        });
    });

    it('should handle database errors', async () => {
      mockDatabase.run.mockRejectedValue(new Error('Database error'));

      await request(app)
        .delete('/api/users/1')
        .expect(500)
        .expect((res) => {
          expect(res.body.error).toBe('Internal server error');
        });
    });
  });
});

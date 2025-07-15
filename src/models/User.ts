import { Database } from '../database';

export interface User {
  id?: number;
  email: string;
  username: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  email: string;
  username: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}

export class UserModel {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async create(userData: CreateUserData): Promise<User> {
    const sql = `
      INSERT INTO users (email, username, password_hash, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await this.db.run(sql, [
      userData.email,
      userData.username,
      userData.password_hash,
      userData.first_name,
      userData.last_name,
    ]);

    const user = await this.findById(result.lastID!);
    return user!;
  }

  async findById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const user = await this.db.get(sql, [id]);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const user = await this.db.get(sql, [email]);
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const user = await this.db.get(sql, [username]);
    return user || null;
  }

  async findAll(): Promise<User[]> {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    return await this.db.all(sql);
  }

  async update(id: number, updates: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updates).filter((key) => key !== 'id');
    const values = fields.map((field) => updates[field as keyof User]);

    if (fields.length === 0) {
      return this.findById(id);
    }

    const sql = `
      UPDATE users 
      SET ${fields.map((field) => `${field} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await this.db.run(sql, [...values, id]);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM users WHERE id = ?';
    const result = await this.db.run(sql, [id]);
    return result.changes! > 0;
  }
}

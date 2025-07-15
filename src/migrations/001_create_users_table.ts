import { Database } from '../database';
import { Migration } from './index';

export const createUsersTable: Migration = {
  async up(): Promise<void> {
    const db = Database.getInstance();
    const sql = `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.run(sql);

    // Create an index on email for faster lookups
    await db.run('CREATE INDEX idx_users_email ON users(email)');
    
    // Create an index on username for faster lookups
    await db.run('CREATE INDEX idx_users_username ON users(username)');
  },

  async down(): Promise<void> {
    const db = Database.getInstance();
    await db.run('DROP TABLE IF EXISTS users');
  }
};
import { Database } from '../database';

export interface Migration {
  up(): Promise<void>;
  down(): Promise<void>;
}

export class MigrationRunner {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  public async initializeMigrationsTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await this.db.run(sql);
  }

  public async hasRun(filename: string): Promise<boolean> {
    const result = await this.db.get(
      'SELECT 1 FROM migrations WHERE filename = ?',
      [filename]
    );
    return !!result;
  }

  public async markAsRun(filename: string): Promise<void> {
    await this.db.run(
      'INSERT INTO migrations (filename) VALUES (?)',
      [filename]
    );
  }

  public async markAsNotRun(filename: string): Promise<void> {
    await this.db.run(
      'DELETE FROM migrations WHERE filename = ?',
      [filename]
    );
  }

  public async runMigrations(migrations: { [filename: string]: Migration }): Promise<void> {
    await this.initializeMigrationsTable();

    for (const [filename, migration] of Object.entries(migrations)) {
      const hasRun = await this.hasRun(filename);
      if (!hasRun) {
        console.log(`Running migration: ${filename}`);
        try {
          await migration.up();
          await this.markAsRun(filename);
          console.log(`Migration completed: ${filename}`);
        } catch (error) {
          console.error(`Migration failed: ${filename}`, error);
          throw error;
        }
      }
    }
  }

  public async rollbackMigration(filename: string, migration: Migration): Promise<void> {
    const hasRun = await this.hasRun(filename);
    if (hasRun) {
      console.log(`Rolling back migration: ${filename}`);
      try {
        await migration.down();
        await this.markAsNotRun(filename);
        console.log(`Migration rolled back: ${filename}`);
      } catch (error) {
        console.error(`Migration rollback failed: ${filename}`, error);
        throw error;
      }
    }
  }
}
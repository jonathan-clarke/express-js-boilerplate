import app from './app';
import { MigrationRunner } from './migrations';
import { migrations } from './migrations/registry';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  // Only run migrations if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    try {
      const migrationRunner = new MigrationRunner();
      await migrationRunner.runMigrations(migrations);
      console.log('Database migrations completed');
    } catch (error) {
      console.error('Failed to run migrations:', error);
      process.exit(1);
    }
  }
  
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});

export { app, server };
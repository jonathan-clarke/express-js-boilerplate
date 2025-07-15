import { Migration } from './index';
import { createUsersTable } from '../users/users.migration';

export const migrations: { [filename: string]: Migration } = {
  '001_create_users_table': createUsersTable,
};

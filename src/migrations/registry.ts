import { Migration } from './index';
import { createUsersTable } from './001_create_users_table';

export const migrations: { [filename: string]: Migration } = {
  '001_create_users_table': createUsersTable,
};
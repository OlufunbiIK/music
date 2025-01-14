/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';

//for migration - a file containing instructions for creating, modifying and deleting db tables, columns and constraints
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'olufunbi',
  database: 'blog',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/**/*.{ts,js}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions); //4.
export default dataSource;

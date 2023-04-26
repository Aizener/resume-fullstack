import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '271019',
  database: 'resume',
  entities: ['dist/**/*.entities.js'],
  migrations: ['dist/**/migrations/*.js'],
});

export default AppDataSource;

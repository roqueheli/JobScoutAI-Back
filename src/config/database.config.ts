import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'Cr8st8n1',
  database: process.env.DB_DATABASE || 'jobscoutai',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
}));
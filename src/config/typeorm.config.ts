import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '111111',
  database: 'taskmanagement',
  entities: [__dirname + '/../**/*.entity.*s'],
  synchronize: true,
};


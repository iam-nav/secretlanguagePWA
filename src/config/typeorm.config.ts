import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  autoLoadEntities: true,
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  extra: {
    max: 100, //maximum connection which postgresql or mysql can intiate
    min: 0, //maximum connection which postgresql or mysql can intiate
    acquire: 20000, // time require to reconnect
    idle: 20000, // get idle connection
    evict: 10000, // it actualy removes the idle connection
  },
};

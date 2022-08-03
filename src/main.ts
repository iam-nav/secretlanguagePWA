import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppClusterService } from './app-cluster.service';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));

  app.use('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /');
  });

  app.setGlobalPrefix('v1');
  app.use(morgan('dev'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Secret Language API')
    .setDescription('Secret Language CRUD api')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, doc);

  // const port = serverConfig.port;
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

// AppClusterService.clusterize(bootstrap);
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.NODE_PORT;
  const version = process.env.npm_package_version;

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('CinePik Authentication API')
    .setDescription('The CinePik Authentication microservice.')
    .setVersion(version)
    .addServer(`http://localhost:${port}`)
    .addServer('http://cinepik.fun/auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable DTO validation
  app.useGlobalPipes(new ValidationPipe());

  console.log(`App version ${version}`);
  console.log(`Listening on port ${port}`);
  await app.listen(port);
}
bootstrap();

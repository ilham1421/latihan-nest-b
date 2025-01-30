import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())

  app.enableCors({
    origin: "",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('LATIHAN NEST JS KELAS - B')
    .setDescription('Muh. Ilham Akbar - 105841105822')
    .setVersion('0.1')
    .addTag('LATIHAN 1')
    .addBearerAuth()
    .build();
  
    const documentFactory = () => SwaggerModule.createDocument(app, config);
  
    SwaggerModule.setup('api-docs', app, documentFactory);
  
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

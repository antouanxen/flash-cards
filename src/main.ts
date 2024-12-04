import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './utils/customExceptionFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthenticateUser } from 'firebase/firebaseAuthentication';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(new AuthenticateUser().use);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true }
  }))

     // Swagger Config
  const swagConfig = new DocumentBuilder()
  .setDescription(`Use the base API URL as http://localhost:8000. If it does not work ask Tony`)
  .setTermsOfService(`http://localhost:8000/api/terms-of-service`)
  .addServer('http://192.168.1.17:8000')
  .setTitle('Flashcards app - API')
  .setVersion('1.0')
  .build()
  // Instatiate Swagger
  const swagDocument = SwaggerModule.createDocument(app, swagConfig)
  SwaggerModule.setup('api', app, swagDocument, {
    customSiteTitle: 'FlashCards Doc-station',
    customCss: '.swagger-ui .topbar { display: none }',
  })

  app.useGlobalFilters(new CustomExceptionFilter())

  await app.listen(8000, () => {
    console.log('the game is begin');
    
  });
}
bootstrap();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const common_1 = require("@nestjs/common");
const customExceptionFilter_1 = require("./utils/customExceptionFilter");
const swagger_1 = require("@nestjs/swagger");
const firebaseAuthentication_1 = require("../firebase/firebaseAuthentication");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.use(new firebaseAuthentication_1.AuthenticateUser().use);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true }
    }));
    const swagConfig = new swagger_1.DocumentBuilder()
        .setDescription(`Use the base API URL as http://localhost:8000. If it does not work ask Tony`)
        .setTermsOfService(`http://localhost:8000/api/terms-of-service`)
        .addServer('http://192.168.1.17:8000')
        .setTitle('Flashcards app - API')
        .setVersion('1.0')
        .build();
    const swagDocument = swagger_1.SwaggerModule.createDocument(app, swagConfig);
    swagger_1.SwaggerModule.setup('api', app, swagDocument, {
        customSiteTitle: 'FlashCards Doc-station',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    app.useGlobalFilters(new customExceptionFilter_1.CustomExceptionFilter());
    await app.listen(8000, () => {
        console.log('the game is begin');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('API Devgon')
      .setDescription('API Devgon test')
      .setVersion('1.0')
      .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

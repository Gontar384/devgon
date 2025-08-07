import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('API Devgon')
    .setDescription('API Devgon test')
    .setVersion('1.0')
    .build();
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ example: '6d7922bd-83a1-2412-8c6d-b0ee20e11284' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  role: string;
}

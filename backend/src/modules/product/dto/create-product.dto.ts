import {ApiProperty} from "@nestjs/swagger";
import { IsString } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'Laptop' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Szybki laptop gamingowy' })
    @IsString()
    description: string;
}
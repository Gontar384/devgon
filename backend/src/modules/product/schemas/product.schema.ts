import {Schema, Prop, SchemaFactory} from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Product extends Document {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
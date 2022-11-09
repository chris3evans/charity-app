import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { charity } from '../charities/charities.schema';

export type ItemDocument = HydratedDocument<item>;

@Schema()
export class item {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  img_url: string;

  @Prop()
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'charity' })
  charity_shop: charity;
}

export const ItemSchema = SchemaFactory.createForClass(item);

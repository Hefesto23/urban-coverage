import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ServiceAreaDocument = ServiceArea & Document;

@Schema()
export class Location {
  @Prop({
    // Type of Location
    type: String,
    required: true,
    enum: ['Point', 'Polygon'],
  })
  type: string;

  @Prop({
    // Specified coordinates of location
    type: [],
    required: true,
  })
  coordinates: number[][][];
}

@Schema()
export class ServiceArea {
  @Prop()
  name: string;

  @Prop(Location)
  location: Location;
}

export const ServiceAreaSchema = SchemaFactory.createForClass(ServiceArea);

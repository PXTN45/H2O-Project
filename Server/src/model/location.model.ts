import { Schema, model, Document } from "mongoose";

// Define the interface for the Location schema
export interface Location extends Document {
  name_location: string;
  province_location: string;
  district_location: string;
  subdistrict_location: string;
  zipcode_location: number;
  latitude_location: string;
  longitude_location: string;
  radius_location: number;
}

const LocationSchema = new Schema<Location>(
  {
    name_location: {
      type: String,
      required: true,
    },
    province_location: {
      type: String,
      required: true,
    },
    district_location: {
      type: String,
      required: true,
    },
    subdistrict_location: {
      type: String,
      required: true,
    },
    zipcode_location: {
      type: Number,
      required: true,
    },
    latitude_location: {
      type: String,
      required: true,
    },
    longitude_location: {
      type: String,
      required: true,
    },
    radius_location: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LocationModel = model<Location>("Location", LocationSchema);
export default LocationModel;

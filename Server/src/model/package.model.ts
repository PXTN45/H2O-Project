import { Schema, model, Document } from "mongoose";
import { Location } from "./location.model";
import { Image } from "./image.model";

// Define the interface for the Package schema
interface Package extends Document {
  name_package: string;
  type_package: string;
  max_people: number;
  detail_package: string;
  activity_package: { activity_name: string }[];
  time_start_package: Date;
  time_end_package: Date;
  policy_cancel_package: string;
  location: Location[];
  image: Image[];
  price_package: number;
  homestay?: Schema.Types.ObjectId[];
  business_user: Schema.Types.ObjectId[];
  review_rating_package: number;
}

const PackageSchema = new Schema<Package>({
  name_package: {
    type: String,
    required: true,
  },
  type_package: {
    type: String,
    required: true,
  },
  max_people: {
    type: Number,
    required: true,
  },
  detail_package: {
    type: String,
    required: true,
  },
  activity_package: {
    type: [
      {
        activity_name: {
          type: String,
        },
      },
    ],
    required: true,
  },
  time_start_package: {
    type: Date,
    required: true,
  },
  time_end_package: {
    type: Date,
    required: true,
  },
  policy_cancel_package: {
    type: String,
    required: true,
  },
  location: {
    type: [{ type: Schema.Types.ObjectId, ref: "Location" }],
    required: true,
  },
  image: {
    type: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    required: true,
  },
  price_package: {
    type: Number,
    required: true,
  },
  homestay: {
    type: [{ type: Schema.Types.ObjectId, ref: "Homestay" }],
  },
  business_user: {
    type: [{ type: Schema.Types.ObjectId, ref: "Business_User" }],
    required: true,
  },
  review_rating_package: {
    type: Number,
    required: true,
  },
});

const PackageModel = model<Package>("Package", PackageSchema);

export default PackageModel;

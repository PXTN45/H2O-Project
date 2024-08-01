import { Schema, model, Document } from "mongoose";

// Define the interface for the User schema
export interface Review extends Document {
  reviewer: Schema.Types.ObjectId;
  content: string;
  rating: number;
  package: Schema.Types.ObjectId;
  homestay: Schema.Types.ObjectId;
}

const reviewSchema = new Schema<Review>({
  reviewer: {
    type: Schema.Types.ObjectId , ref:"User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  package: {
    type: Schema.Types.ObjectId , ref:"Package",
    default: null,
  },

  homestay: {
    type:Schema.Types.ObjectId, ref:"HomeStay",
    default: null,
  },
  
});

const reviewModel = model<Review>("Review", reviewSchema);

export default reviewModel;

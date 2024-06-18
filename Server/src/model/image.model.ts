import { Schema, model, Document } from "mongoose";

// Define the interface for the Image schema
export interface Image extends Document {
  image_upload: string;
}

const ImagesSchema = new Schema<Image>({
  image_upload: {
    type: String,
    required: true,
  },
});

const ImageModel = model<Image>("Image", ImagesSchema);
export default ImageModel;

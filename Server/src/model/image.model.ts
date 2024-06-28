import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IImage extends Document {
  image_upload: string;
}

const ImageSchema: Schema = new Schema({
  image_upload: { type: String, required: true },
});

const Image: Model<IImage> = mongoose.model<IImage>('Image', ImageSchema);
export default Image;

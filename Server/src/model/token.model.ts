import { Schema, model, Document } from "mongoose";

interface Token extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const tokenSchema = new Schema<Token>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const TokenModel = model<Token>("token", tokenSchema);

export default TokenModel;

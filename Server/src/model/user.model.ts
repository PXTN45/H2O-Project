import { Schema, model, Document } from "mongoose";

// Define the interface for the User schema
export interface User extends Document {
  email: string;
  password: string;
  fname: string;
  lname: string;
  phonenumber: number;
  image: string;
  role: string;
}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    minlength: 4,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  phonenumber: {
    type: Number,
  },
  image: {
    type: String,
  },
  role: { type: String, enum: ["admin","business", "user"], default: "user" },
});

const UserModel = model<User>("User", UserSchema);
export default UserModel;

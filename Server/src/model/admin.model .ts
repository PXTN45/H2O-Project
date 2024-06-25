import { Schema, model, Document } from "mongoose";

// Define the interface for the User schema
export interface Admin extends Document {
  email: string;
  password: string;
  fname: string;
  lname: string;
  birthday:Date;
  phonenumber: string;
  image: string;
  role: string;
}

const AdminSchema = new Schema<Admin>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    default: null
  },
  phonenumber: {
    type: String,
    minlength: 12,
    maxlength: 12,
    required: true,
  },
  image: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg",
    required: true,
  },
  role: { type: String, enum: ["admin"], default: "admin" },
});

const AdminModel = model<Admin>("Admin", AdminSchema);
export default AdminModel;

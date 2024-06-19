import { Schema, model, Document } from "mongoose";

// Define the interface for the User schema
export interface User extends Document {
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  email: { 
    type: String, 
    required: true, 
    minlength: 4, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
});

const UserModel = model<User>("User", UserSchema);
export default UserModel;

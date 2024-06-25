import { Schema, model, Document } from "mongoose";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User extends Document {
  email: string;
  password: string;
  fname: string;
  lname: string;
  birthday?: Date;
  phonenumber: string;
  image?: string;
  addresses: Address[];
  role: string;
}

const AddressSchema = new Schema<Address>({
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  postalCode: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  }
});

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
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
    trim: true
  },
  image: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg"
  },
  addresses: {
    type: [AddressSchema],
    default: [{
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }]
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user"
  }
});

const UserModel = model<User>("User", UserSchema);

export default UserModel;

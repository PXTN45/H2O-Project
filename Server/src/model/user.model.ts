import { Schema, model, Document } from "mongoose";
<<<<<<< HEAD
// import jwt from "jsonwebtoken";
// import Joi, { ObjectSchema, ValidationResult } from "joi";
// import passwordComplexity from "joi-password-complexity";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
=======
>>>>>>> 3333c0426dff0e8a36a9f10581e711ec50617b7d

export interface User extends Document {
  email: string;
  password: string;
  fname: string;
  lname: string;
  birthday?: Date;
  phonenumber: string;
  image?: string;
  addresses: Address[];
  isVerified:boolean;
  role: string;
}

export interface Address {
  houseNumber:  string;
  village: string;
  district: string;
  street: string;
  city : string;
  country: string;
  postalCode: string;
}

const AddressSchema = new Schema<Address>({
  houseNumber: {
    type: String,
    default: ""
  },
  village: {
    type: String,
    default: ""
  },
  district: {
    type: String,
    default: ""
  },
  street: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  postalCode: {
    type: String,
    default: ""
  },
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
      houseNumber: "",
      village: "",
      district: "",
      street: "",
      city: "",
      country: "",
      postalCode: "",
    }]
  },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user"],
    default: "user"
  }
});

const UserModel = model<User>("User", UserSchema);

export default UserModel;

import { Schema, model, Document } from "mongoose";

export interface Business extends Document {
  email: string;
  password: string;
  bname:string;
  fname: string;
  lname: string;
  birthday:Date;
  phonenumber: string;
  image: string;
  addresses: Address[];
  idcard:string;
  BankingName:string;
  BankingUsername:string;
  BankingUserlastname:string;
  BankingCode:string;
  role: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
  },
});

const BusinessSchema = new Schema<Business>({
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
  bname: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    default: ""
  },
  lname: {
    type: String,
    default: ""
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
    trim: true,
  },
  image: {
    type: String,
    required: true,
    default: "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg",
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
  idcard: {
    type: String,
    minlength: 13,
    maxlength: 13,
    default: ""
  },
  BankingName: {
    type: String, 
    default: ""
  },
  BankingUsername: {
    type: String, 
    default: ""
  },
  BankingUserlastname: {
    type: String,
    default: ""
  },
  BankingCode: {
    type: String,
    minlength: 10,
    default: ""
  },
  role: { type: String, enum: ["business"], default: "business" },
});

const BusinessModel = model<Business>("Business", BusinessSchema);
export default BusinessModel;

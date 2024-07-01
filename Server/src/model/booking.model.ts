import { Schema, model, Document } from "mongoose";
import UserModel from "./user.model";

export interface Booking extends Document {
    booker : Schema.Types.ObjectId[],
    bookingDate : Date,
    bookingStatus : Boolean,
    paymentDetail: string,

}

const BookingSchema = new Schema<Booking>({
  booker : [{
    type:Schema.Types.ObjectId , ref:"User",
    required:true
  }],
  bookingDate:{
    type: Date,
    required:true
  },
  bookingStatus:{
    type: Boolean,
    required:true
  },
  paymentDetail:{
    type: String,
    required:true
  }
});

const BookingModel = model<Booking>("Booking", BookingSchema);

export default BookingModel;

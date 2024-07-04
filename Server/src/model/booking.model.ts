import { Schema, model, Document } from "mongoose";


export interface Booking extends Document {
    booker : Schema.Types.ObjectId[];
    homeStayDetail: Schema.Types.ObjectId[];
    packageDetail :Schema.Types.ObjectId[];
    bookingDate : Date;
    bookingStatus : string;
    paymentDetail: string; // เช่น "Credit Card", "PayPal", "Bank Transfer"
    createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<Booking>({
  booker : [{
    type:Schema.Types.ObjectId , ref:"User",
    required:true
  }],
  homeStayDetail:[{
    type:Schema.Types.ObjectId, ref:"HomeStay",
    required: true,
  }],
  packageDetail:[{
    type: Schema.Types.ObjectId , ref:"Package",
    required:true
  }],
  bookingDate:{
    type: Date,
    default: Date.now
  },
  bookingStatus:{
    type: String,
    required:true,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
    
  },
  paymentDetail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

const BookingModel = model<Booking>("Booking", BookingSchema);

export default BookingModel;

import { Schema, model, Document } from "mongoose";


export interface Booking extends Document {
    booker : Schema.Types.ObjectId[];
    homeStay: Schema.Types.ObjectId;
    package :Schema.Types.ObjectId;
    bookingStart : Date;
    bookingEnd : Date;
    night:number,
    bookingStatus : string;
    paymentDetail: string; 
}

const BookingSchema = new Schema<Booking>({
  booker : [{
    type:Schema.Types.ObjectId , ref:"User",
    required:true
  }],
  homeStay:{
    type:Schema.Types.ObjectId, ref:"HomeStay",
    required:false,
  },
  package:{
    type: Schema.Types.ObjectId , ref:"Package",
    required:false
  },
  bookingStart:{
    type: Date,
    required:true
  },
  bookingEnd:{
    type: Date,
    required:true
  },
  night:{
    type: Number,
    required:true
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
  }

});

const BookingModel = model<Booking>("Booking", BookingSchema);

export default BookingModel;

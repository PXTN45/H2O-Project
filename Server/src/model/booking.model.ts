import { Schema, model, Document } from "mongoose";


export interface Booking extends Document {
    booker : Schema.Types.ObjectId[],
    homeStayDetail: Schema.Types.ObjectId[],
    packageDetail :Schema.Types.ObjectId[],
    bookingDate : Date,
    bookingStatus : Boolean,
    paymentDetail: string,
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
    required:true
  },
  bookingStatus:{
    type: Boolean,
    required:true,
    default: false
    
  },
  paymentDetail:{
    type: String,
    required:true
  }
});

const BookingModel = model<Booking>("Booking", BookingSchema);

export default BookingModel;

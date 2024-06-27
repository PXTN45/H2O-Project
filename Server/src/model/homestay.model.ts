import { Schema, model, Document } from "mongoose";
import { Location } from "./location.model";
import { Image } from "./image.model";

interface HomeStay extends Document {
    name_homeStay: string;
    type_homeStay: string;
    max_people: number;
    detail_homeStay: string;
    time_checkIn_homeStay: Date;
    time_checkOut_homeStay: Date;
    policy_cancel_homeStay: string;
    location: Location[];
    image: Image[];
    price_homeStay: number;
    business_user: Schema.Types.ObjectId[];
    review_rating_homeStay: number;
    facilities: { facilities_name: string }[];
    bathroom_homeStay: number;
    bedroom_homeStay: number;
    sizeBedroom_homeStay: string;
    status_sell_homeStay: boolean;
  }


const HomeStaySchema = new Schema<HomeStay>({
  name_homeStay: {
    type: String,
    required: true,
  },
  type_homeStay: {
    type: String,
    required: true,
  },
  max_people: {
    type: Number,
    required: true,
  },
  detail_homeStay: {
    type: String,
    required: true,
  },
  time_checkIn_homeStay: {
    type: Date,
    required: true,
  },
  time_checkOut_homeStay: {
    type: Date,
    required: true,
  },
  policy_cancel_homeStay: {
    type: String,
    required: true,
  },
  location: {
    type: [{ type: Schema.Types.ObjectId, ref: "Location" }],
    required: true,
  },
  image: {
    type: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    required: true,
},
  price_homeStay: {
    type: Number,
    required: true,
  },
  business_user: [{
    type: Schema.Types.ObjectId,
    ref: 'Business_User',
    required: true,
  }],
  review_rating_homeStay: {
    type: Number,
    required: true,
  },
  facilities: [{
    facilities_name: {
      type: String,
      required: true,
    },
  }],
  bathroom_homeStay: {
    type: Number,
    required: true,
  },
  bedroom_homeStay: {
    type: Number,
    required: true,
  },
  sizeBedroom_homeStay: {
    type: String,
    required: true,
  },
  status_sell_homeStay : {
    type : Boolean,
    required:true,
  },
});

 const HomeStayModel = model<HomeStay>('HomeStay', HomeStaySchema);
export default HomeStayModel
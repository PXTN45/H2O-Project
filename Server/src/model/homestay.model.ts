import { Schema, model, Document } from "mongoose";

interface HomeStay extends Document {
  name_homeStay: string;
  room_type: {
    bathroom_homeStay: number;
    bedroom_homeStay: number;
    sizeBedroom_homeStay: string;
  }[];
  max_people: number;
  detail_homeStay: string;
  time_checkIn_homeStay: Date;
  time_checkOut_homeStay: Date;
  policy_cancel_homeStay: string;
  location: {
    name_location: string;
    province_location: string;
    district_location: string;
    subdistrict_location: string;
    zipcode_location: number;
    latitude_location: string;
    longitude_location: string;
    radius_location: number;
  }[];
  image: { image_upload: string }[];
  price_homeStay: number;
  business_user: Schema.Types.ObjectId[];
  review_rating_homeStay: number;
  facilities: { facilities_name: string }[];
  status_sell_homeStay: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HomeStaySchema = new Schema<HomeStay>({
  name_homeStay: {
    type: String,
    required: true,
  },
  room_type: {
    type: [
      {
        bathroom_homeStay: { type: Number, required: true },
        bedroom_homeStay: {type: Number,required: true},
        sizeBedroom_homeStay: {type: String,required: true},
        price_homeStay: {type: Number , required: true},
      },
    ],
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
    type: [
      {
        name_location: { type: String, required: true },
        province_location: { type: String, required: true },
        district_location: { type: String, required: true },
        subdistrict_location: { type: String, required: true },
        zipcode_location: { type: Number, required: true },
        latitude_location: { type: String, required: true },
        longitude_location: { type: String, required: true },
        radius_location: { type: Number, required: true },
      },
    ],
  },
  image: {
    type: [
      {
        image_upload: {
          type: String,
          required: true,
        },
      },
    ],
  },

  business_user: [
    {
      type: Schema.Types.ObjectId,
      ref: "Business_User",
      required: true,
    },
  ],
  review_rating_homeStay: {
    type: Number,
    required: true,
  },
  facilities: [
    {
      facilities_name: {
        type: String,
        required: true,
      },
    },
  ],
  status_sell_homeStay: {
    type: Boolean,
    required: true,
  }, createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const HomeStayModel = model<HomeStay>("HomeStay", HomeStaySchema);
export default HomeStayModel;

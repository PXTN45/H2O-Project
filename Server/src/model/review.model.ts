import { Schema, model, Document } from "mongoose";

// Define the interface for the Review schema
export interface Review extends Document {
  reviewer: Schema.Types.ObjectId;
  content: string;
  rating: number;
  package: Schema.Types.ObjectId | null;
  homestay: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<Review>({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // เพิ่ม index สำหรับการค้นหาที่เร็วขึ้น
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    validate: {
      validator: function(value: number) {
        return value >= 1 && value <= 5;
      },
      message: 'Rating must be between 1 and 5',
    },
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    default: null,
    index: true, // เพิ่ม index สำหรับการค้นหาที่เร็วขึ้น
  },
  homestay: {
    type: Schema.Types.ObjectId,
    ref: "HomeStay",
    default: null,
    index: true, // เพิ่ม index สำหรับการค้นหาที่เร็วขึ้น
  },
}, { timestamps: true }); // ใช้ timestamps เพื่อจัดการ createdAt และ updatedAt อัตโนมัติ

// ก่อนบันทึก อัปเดตฟิลด์ updatedAt
reviewSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const reviewModel = model<Review>("Review", reviewSchema);

export default reviewModel;

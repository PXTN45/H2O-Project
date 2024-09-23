import { Schema, model, Document } from "mongoose";

// Interface สำหรับ Review
export interface Review extends Document {
  reviewer: Schema.Types.ObjectId;
  content: string;
  rating: number;
  package: Schema.Types.ObjectId | null;
  homestay: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  responses: Response[]; // ฟิลด์สำหรับการตอบกลับ
}

// Interface สำหรับ Response
export interface Response {
  responder: Schema.Types.ObjectId; // ผู้ตอบกลับ (เจ้าของธุรกิจ)
  content: string; // เนื้อหาของการตอบกลับ
  createdAt: Date; // วันที่ตอบกลับ
}

// สร้าง schema สำหรับ review (รีวิว) โดยรวม response ไว้ในที่เดียว
const reviewSchema = new Schema<Review>({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    index: true,
    // ไม่กำหนดค่าเริ่มต้น
  },
  homestay: {
    type: Schema.Types.ObjectId,
    ref: "HomeStay",
    index: true,
    // ไม่กำหนดค่าเริ่มต้น
  },
  responses: [{
    responder: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
}, { timestamps: true });


// สร้างโมเดล review และส่งออก (export)
const reviewModel = model<Review>("Review", reviewSchema);

export default reviewModel;

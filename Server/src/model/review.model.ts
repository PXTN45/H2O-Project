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
    ref: "User", // เชื่อมโยงกับ User collection สำหรับผู้รีวิว
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true, // ต้องการค่า แต่ไม่ต้องตรวจสอบใน model แล้ว
  },
  package: {
    type: Schema.Types.ObjectId,
    ref: "Package",
    default: null,
    index: true,
  },
  homestay: {
    type: Schema.Types.ObjectId,
    ref: "HomeStay",
    default: null,
    index: true,
  },
  // ฟิลด์สำหรับการตอบกลับที่ฝังอยู่ภายใน reviewSchema
  responses: [{
    responder: {
      type: Schema.Types.ObjectId,
      ref: "Business", // เชื่อมโยงกับ businesses collection
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

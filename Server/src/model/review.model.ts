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
  responder: Schema.Types.ObjectId; // ผู้ตอบกลับ (admin)
  content: string; // เนื้อหาของการตอบกลับ
  createdAt: Date; // วันที่ตอบกลับ
}

// สร้าง schema สำหรับ response (การตอบกลับ)
const responseSchema = new Schema<Response>({
  responder: {
    type: Schema.Types.ObjectId,
    ref: "User", // เชื่อมโยงกับ User collection
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // ตั้งวันที่ตอบกลับเป็นวันปัจจุบัน
  }
}, { _id: false }); // ปิดการสร้าง _id สำหรับ response เนื่องจากเป็น subdocument

// สร้าง schema สำหรับ review (รีวิว)
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
    validate: {
      validator: function (value: number) {
        return value >= 1 && value <= 5;
      },
      message: 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5',
    },
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
  responses: [responseSchema], // ใช้ schema สำหรับ responses ใน array
}, { timestamps: true });

// สร้างโมเดล review และส่งออก (export)
const reviewModel = model<Review>("Review", reviewSchema);

export default reviewModel;

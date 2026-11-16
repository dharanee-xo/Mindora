import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHabitRecord extends Document {
  userId: Types.ObjectId;
  title: string;
  category: string;
  targetFrequency: string;
  completedDates: string[];
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const HabitRecordSchema = new Schema<IHabitRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "general",
    },
    targetFrequency: {
      type: String,
      default: "daily",
    },
    completedDates: {
      type: [String],
      default: [],
    },
    streak: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

HabitRecordSchema.index({ userId: 1, title: 1 });

const HabitRecord: Model<IHabitRecord> =
  mongoose.models.HabitRecord ||
  mongoose.model<IHabitRecord>("HabitRecord", HabitRecordSchema);

export default HabitRecord;

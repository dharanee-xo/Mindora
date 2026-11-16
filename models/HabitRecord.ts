import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabitRecord extends Document {
  userId: string;
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
  streakCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const HabitRecordSchema = new Schema<IHabitRecord>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
    },
    completedHabitIds: {
      type: [String],
      default: [],
    },
    streakCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

HabitRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

const HabitRecord: Model<IHabitRecord> =
  mongoose.models.HabitRecord ||
  mongoose.model<IHabitRecord>("HabitRecord", HabitRecordSchema);

export default HabitRecord;

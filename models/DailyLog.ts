import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDailyLog extends Document {
  userId: string;
  date: string; // YYYY-MM-DD
  dayLabel: string;
  screenTime: number;
  socialMedia: number;
  gaming: number;
  sleep: number;
  study: number;
  breaks: number;
  physicalActivityMinutes: number;
  mood: "Positive" | "Neutral" | "Negative" | "Depressed";
  reflection: string;
  syncMode: "manual" | "auto";
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    dayLabel: {
      type: String,
      default: "Today",
    },
    screenTime: {
      type: Number,
      default: 0,
    },
    socialMedia: {
      type: Number,
      default: 0,
    },
    gaming: {
      type: Number,
      default: 0,
    },
    sleep: {
      type: Number,
      default: 0,
    },
    study: {
      type: Number,
      default: 0,
    },
    breaks: {
      type: Number,
      default: 0,
    },
    physicalActivityMinutes: {
      type: Number,
      default: 0,
    },
    mood: {
      type: String,
      enum: ["Positive", "Neutral", "Negative", "Depressed"],
      default: "Neutral",
    },
    reflection: {
      type: String,
      default: "",
    },
    syncMode: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one log per user per date
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog: Model<IDailyLog> =
  mongoose.models.DailyLog || mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);

export default DailyLog;

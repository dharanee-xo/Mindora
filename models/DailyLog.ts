import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IDailyLog extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  moodScore: number; // 1-10
  stressLevel: number; // 1-10
  sleepHours: number;
  screenTimeMinutes: number;
  notes: string;
  // UI companion fields
  dayLabel?: string;
  screenTimeHours?: number;
  socialMediaHours?: number;
  gamingHours?: number;
  studyHours?: number;
  breaksCount?: number;
  physicalActivityMinutes?: number;
  mood?: string;
  syncMode?: "manual" | "auto";
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    moodScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 7,
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 3,
    },
    sleepHours: {
      type: Number,
      default: 7.5,
    },
    screenTimeMinutes: {
      type: Number,
      default: 280,
    },
    notes: {
      type: String,
      default: "",
    },
    // Optional compatibility fields for rich dashboard metrics
    dayLabel: {
      type: String,
      default: "Today",
    },
    screenTimeHours: {
      type: Number,
      default: 4.8,
    },
    socialMediaHours: {
      type: Number,
      default: 1.2,
    },
    gamingHours: {
      type: Number,
      default: 0.5,
    },
    studyHours: {
      type: Number,
      default: 4.5,
    },
    breaksCount: {
      type: Number,
      default: 5,
    },
    physicalActivityMinutes: {
      type: Number,
      default: 30,
    },
    mood: {
      type: String,
      default: "Neutral",
    },
    syncMode: {
      type: String,
      enum: ["manual", "auto"],
      default: "manual",
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

// Compound index so a user only has one daily log per date
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyLog: Model<IDailyLog> =
  mongoose.models.DailyLog ||
  mongoose.model<IDailyLog>("DailyLog", DailyLogSchema);

export default DailyLog;

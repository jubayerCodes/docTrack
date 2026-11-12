import { Schema, model, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  phone: string;
  email?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Patient phone is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    age: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [0, 'Age cannot be negative'],
      max: [130, 'Age exceeds standard limit'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
      default: 'Other',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);

// Search and compound indexes
PatientSchema.index({ name: 'text', phone: 'text' });
PatientSchema.index({ name: 1, phone: 1 });
PatientSchema.index({ createdAt: -1 });

export const Patient = model<IPatient>('Patient', PatientSchema);

import { Schema, model, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      index: true,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital or clinic name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);

// Compound indexes for query optimization and search
DoctorSchema.index({ name: 'text', hospital: 'text', specialization: 'text' });
DoctorSchema.index({ specialization: 1, createdAt: -1 });
DoctorSchema.index({ name: 1, hospital: 1 });

export const Doctor = model<IDoctor>('Doctor', DoctorSchema);

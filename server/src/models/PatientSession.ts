import { Schema, model, Document, Types } from 'mongoose';

export type SessionStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface IPatientSession extends Document {
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  condition: string;
  sessionDate: Date;
  appointmentAt: string; // e.g., "10:30 AM"
  status: SessionStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSessionSchema = new Schema<IPatientSession>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
      index: true,
    },
    condition: {
      type: String,
      required: [true, 'Medical condition / diagnosis is required'],
      trim: true,
      index: true,
    },
    sessionDate: {
      type: Date,
      required: [true, 'Session date is required'],
      index: true,
    },
    appointmentAt: {
      type: String,
      required: [true, 'Appointment time is required (e.g. 10:30 AM)'],
      trim: true,
      default: '10:00 AM',
    },
    status: {
      type: String,
      enum: ['scheduled', 'active', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
  }
);

// High-performance compound indexes for queries and analytics
PatientSessionSchema.index({ doctorId: 1, status: 1 });
PatientSessionSchema.index({ patientId: 1, doctorId: 1 });
PatientSessionSchema.index({ sessionDate: -1, status: 1 });
PatientSessionSchema.index({ condition: 1, status: 1 });

export const PatientSession = model<IPatientSession>('PatientSession', PatientSessionSchema);

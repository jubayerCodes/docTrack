import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { PatientSession } from '../models/PatientSession';

const DOCTORS_DATA = [
  { name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', hospital: 'St. Jude Memorial Hospital', phone: '+1 (555) 234-8901', email: 's.jenkins@stjude.org' },
  { name: 'Dr. Michael Chang', specialization: 'Neurology', hospital: 'City General Health Center', phone: '+1 (555) 345-6789', email: 'mchang@citygeneral.med' },
  { name: 'Dr. Elena Rostova', specialization: 'Pediatrics', hospital: 'Children’s Hope Clinic', phone: '+1 (555) 456-7890', email: 'e.rostova@hopeclinic.org' },
  { name: 'Dr. Arthur Pendelton', specialization: 'Orthopedics', hospital: 'Metro Health Pavilion', phone: '+1 (555) 567-8901', email: 'arthur.p@metrohealth.net' },
  { name: 'Dr. Aisha Al-Mansoor', specialization: 'Oncology', hospital: 'St. Jude Memorial Hospital', phone: '+1 (555) 678-9012', email: 'a.mansoor@stjude.org' },
  { name: 'Dr. David Sterling', specialization: 'Cardiology', hospital: 'City General Health Center', phone: '+1 (555) 789-0123', email: 'd.sterling@citygeneral.med' },
  { name: 'Dr. Rachel Green', specialization: 'Dermatology', hospital: 'Apex Skin & Laser Institute', phone: '+1 (555) 890-1234', email: 'rachel.green@apexskin.com' },
  { name: 'Dr. Marcus Vance', specialization: 'Psychiatry', hospital: 'MindCare Behavioral Center', phone: '+1 (555) 901-2345', email: 'mvance@mindcare.org' },
  { name: 'Dr. Priya Sharma', specialization: 'General Medicine', hospital: 'St. Jude Memorial Hospital', phone: '+1 (555) 012-3456', email: 'p.sharma@stjude.org' },
  { name: 'Dr. James Wilson', specialization: 'Oncology', hospital: 'Princeton Plainsboro Health', phone: '+1 (555) 123-4567', email: 'jwilson@ppth.edu' },
  { name: 'Dr. Lisa Cuddy', specialization: 'General Medicine', hospital: 'Princeton Plainsboro Health', phone: '+1 (555) 234-5678', email: 'lcuddy@ppth.edu' },
  { name: 'Dr. Robert Chase', specialization: 'Cardiology', hospital: 'City General Health Center', phone: '+1 (555) 345-6780', email: 'rchase@citygeneral.med' },
  { name: 'Dr. Allison Cameron', specialization: 'Immunology', hospital: 'Children’s Hope Clinic', phone: '+1 (555) 456-7891', email: 'acameron@hopeclinic.org' },
  { name: 'Dr. Chris Foreman', specialization: 'Neurology', hospital: 'Metro Health Pavilion', phone: '+1 (555) 567-8902', email: 'cforeman@metrohealth.net' },
  { name: 'Dr. Gregory Finch', specialization: 'Pediatrics', hospital: 'Children’s Hope Clinic', phone: '+1 (555) 678-9013', email: 'gfinch@hopeclinic.org' },
  { name: 'Dr. Benjamin Hayes', specialization: 'Orthopedics', hospital: 'St. Jude Memorial Hospital', phone: '+1 (555) 789-0124', email: 'bhayes@stjude.org' },
  { name: 'Dr. Natalie Portman', specialization: 'Dermatology', hospital: 'Metro Health Pavilion', phone: '+1 (555) 890-1235', email: 'nportman@metrohealth.net' },
  { name: 'Dr. Victor Frank', specialization: 'Psychiatry', hospital: 'City General Health Center', phone: '+1 (555) 901-2346', email: 'vfrank@citygeneral.med' },
];

const PATIENTS_DATA = [
  { name: 'Eleanor Vance', phone: '+1 (555) 789-0123', email: 'eleanor.v@sample.org', age: 42, gender: 'Female' },
  { name: 'Marcus Thorne', phone: '+1 (555) 890-1234', email: 'marcus.t@domain.com', age: 51, gender: 'Male' },
  { name: 'Lisa Raymond', phone: '+1 (555) 901-2345', email: 'lisa.r@healthcare.io', age: 63, gender: 'Female' },
  { name: 'David K. Miller', phone: '+1 (555) 456-7890', email: 'dkmiller@gmail.com', age: 58, gender: 'Male' },
  { name: 'Sophia Chen', phone: '+1 (555) 678-9012', email: 'sophia.c@techcorp.io', age: 29, gender: 'Female' },
  { name: 'Jonathan Hayes', phone: '+1 (555) 123-4567', email: 'jhayes@sample.net', age: 37, gender: 'Male' },
  { name: 'Amara Okafor', phone: '+1 (555) 234-5678', email: 'amara.okafor@gmail.com', age: 45, gender: 'Female' },
  { name: 'Julian Mercer', phone: '+1 (555) 345-6789', email: 'jmercer@workplace.com', age: 62, gender: 'Male' },
  { name: 'Chloe Davenport', phone: '+1 (555) 567-8901', email: 'chloe.d@outlook.com', age: 24, gender: 'Female' },
  { name: 'Liam Gallagher', phone: '+1 (555) 678-1234', email: 'lgallagher@gmail.com', age: 34, gender: 'Male' },
  { name: 'Zoe Saldana', phone: '+1 (555) 789-2345', email: 'zoe.s@creative.org', age: 39, gender: 'Female' },
  { name: 'Robert De Niro', phone: '+1 (555) 890-3456', email: 'robert.d@hollywood.com', age: 78, gender: 'Male' },
  { name: 'Emma Watson', phone: '+1 (555) 901-4567', email: 'emma.w@oxford.ac.uk', age: 33, gender: 'Female' },
  { name: 'Thomas Wayne', phone: '+1 (555) 012-5678', email: 'twayne@wayneent.com', age: 55, gender: 'Male' },
  { name: 'Martha Kent', phone: '+1 (555) 123-6789', email: 'mkent@smallville.net', age: 64, gender: 'Female' },
  { name: 'Oliver Queen', phone: '+1 (555) 234-7890', email: 'oqueen@starling.city', age: 36, gender: 'Male' },
  { name: 'Diana Prince', phone: '+1 (555) 345-8901', email: 'dprince@themyscira.gov', age: 30, gender: 'Female' },
  { name: 'Barry Allen', phone: '+1 (555) 456-9012', email: 'ballen@ccpd.gov', age: 28, gender: 'Male' },
  { name: 'Iris West', phone: '+1 (555) 567-0123', email: 'iwest@centralcitygazette.com', age: 29, gender: 'Female' },
  { name: 'Arthur Curry', phone: '+1 (555) 678-1235', email: 'acurry@atlantis.org', age: 41, gender: 'Male' },
  { name: 'Victor Stone', phone: '+1 (555) 789-2346', email: 'vstone@star-labs.tech', age: 25, gender: 'Male' },
  { name: 'Clark Kent', phone: '+1 (555) 890-3457', email: 'ckent@dailyplanet.com', age: 38, gender: 'Male' },
  { name: 'Lois Lane', phone: '+1 (555) 901-4568', email: 'llane@dailyplanet.com', age: 36, gender: 'Female' },
  { name: 'Hal Jordan', phone: '+1 (555) 012-5679', email: 'hjordan@ferrisair.com', age: 43, gender: 'Male' },
  { name: 'Selina Kyle', phone: '+1 (555) 123-6780', email: 'skyle@gothamnet.org', age: 35, gender: 'Female' },
  { name: 'Bruce Banner', phone: '+1 (555) 234-7891', email: 'bbanner@culver.edu', age: 49, gender: 'Male' },
  { name: 'Natasha Romanoff', phone: '+1 (555) 345-8902', email: 'nromanoff@shield.gov', age: 38, gender: 'Female' },
  { name: 'Steve Rogers', phone: '+1 (555) 456-9013', email: 'srogers@brooklyn.org', age: 104, gender: 'Male' },
  { name: 'Tony Stark', phone: '+1 (555) 567-0124', email: 'tony@starkindustries.com', age: 48, gender: 'Male' },
  { name: 'Pepper Potts', phone: '+1 (555) 678-1236', email: 'ppotts@starkindustries.com', age: 46, gender: 'Female' },
  { name: 'Peter Parker', phone: '+1 (555) 789-2347', email: 'pparker@midtownhigh.edu', age: 21, gender: 'Male' },
  { name: 'Gwen Stacy', phone: '+1 (555) 890-3458', email: 'gstacy@empirestate.edu', age: 22, gender: 'Female' },
  { name: 'Stephen Strange', phone: '+1 (555) 901-4569', email: 'sstrange@metrogeneral.org', age: 45, gender: 'Male' },
  { name: 'Wanda Maximoff', phone: '+1 (555) 012-5670', email: 'wmaximoff@westview.io', age: 31, gender: 'Female' },
  { name: 'Sam Wilson', phone: '+1 (555) 123-6781', email: 'swilson@usaf.mil', age: 40, gender: 'Male' },
  { name: 'Bucky Barnes', phone: '+1 (555) 234-7892', email: 'bbarnes@veterans.org', age: 105, gender: 'Male' },
  { name: 'Carol Danvers', phone: '+1 (555) 345-8903', email: 'cdanvers@airforce.mil', age: 37, gender: 'Female' },
  { name: 'Nick Fury', phone: '+1 (555) 456-9014', email: 'nfury@shield.gov', age: 67, gender: 'Male' },
  { name: 'Maria Hill', phone: '+1 (555) 567-0125', email: 'mhill@shield.gov', age: 39, gender: 'Female' },
  { name: 'Phil Coulson', phone: '+1 (555) 678-1237', email: 'pcoulson@shield.gov', age: 52, gender: 'Male' },
  { name: 'Matt Murdock', phone: '+1 (555) 789-2348', email: 'mmurdock@nelsonmurdock.law', age: 36, gender: 'Male' },
  { name: 'Foggy Nelson', phone: '+1 (555) 890-3459', email: 'fnelson@nelsonmurdock.law', age: 36, gender: 'Male' },
  { name: 'Karen Page', phone: '+1 (555) 901-4560', email: 'kpage@bulletin.com', age: 33, gender: 'Female' },
  { name: 'Jessica Jones', phone: '+1 (555) 012-5671', email: 'jjones@aliainvestigations.ny', age: 34, gender: 'Female' },
  { name: 'Luke Cage', phone: '+1 (555) 123-6782', email: 'lcage@harlemsbarber.com', age: 38, gender: 'Male' },
  { name: 'Danny Rand', phone: '+1 (555) 234-7893', email: 'drand@randcorp.com', age: 32, gender: 'Male' },
  { name: 'Colleen Wing', phone: '+1 (555) 345-8904', email: 'cwing@chikara-dojo.org', age: 31, gender: 'Female' },
  { name: 'Claire Temple', phone: '+1 (555) 456-9015', email: 'ctemple@metrogeneral.org', age: 41, gender: 'Female' },
  { name: 'Frank Castle', phone: '+1 (555) 567-0126', email: 'fcastle@usmc.mil', age: 44, gender: 'Male' },
  { name: 'Peggy Carter', phone: '+1 (555) 678-1238', email: 'pcarter@ssr.gov', age: 92, gender: 'Female' },
];

const CONDITIONS = [
  'Arrhythmia follow-up',
  'Hypertension Management',
  'Angina Pectoris review',
  'Post-stroke rehabilitation',
  'Migraine Chronic Evaluation',
  'Pediatric Wellness & Immunization',
  'Asthma Severity Assessment',
  'Knee Arthroscopy Post-Op',
  'Lumbar Herniation Physical Therapy',
  'Oncology Chemotherapy Cycle 3',
  'Lymphoma Staging Follow-up',
  'Severe Eczema Topicals Review',
  'Psoriasis Biologic Evaluation',
  'Major Depressive Disorder Check',
  'Generalized Anxiety Cognitive Review',
  'Type 2 Diabetes HbA1c Management',
  'Lipid Panel & Statin Titration',
  'Cardiac Stress Test Review',
  'Cervical Radiculopathy',
  'Seasonal Allergy Desensitization',
];

const TIME_SLOTS = [
  '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

const STATUSES: Array<'scheduled' | 'active' | 'completed' | 'cancelled'> = [
  'active', 'active', 'scheduled', 'scheduled', 'completed', 'scheduled', 'active',
];

export const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctrack';

  try {
    await mongoose.connect(mongoURI);

    // Clear existing collections
    await Promise.all([
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      PatientSession.deleteMany({}),
    ]);

    // Seed Doctors
    const createdDoctors = await Doctor.insertMany(DOCTORS_DATA);

    // Seed Patients
    const createdPatients = await Patient.insertMany(PATIENTS_DATA);

    // Seed Sessions (Encounter links)
    const sessions = [];

    // Distribute sessions across doctors and patients
    for (let i = 0; i < createdPatients.length; i++) {
      const patient = createdPatients[i];
      // Every patient has 1-3 sessions
      const sessionCount = (i % 3) + 1;

      for (let s = 0; s < sessionCount; s++) {
        // Pick doctor based on index to ensure balanced caseload
        const docIndex = (i + s * 4) % createdDoctors.length;
        const doctor = createdDoctors[docIndex];

        // Pick condition
        const condIndex = (i * 2 + s) % CONDITIONS.length;
        const condition = CONDITIONS[condIndex];

        // Pick time slot
        const timeIndex = (i + s * 3) % TIME_SLOTS.length;
        const appointmentAt = TIME_SLOTS[timeIndex];

        // Pick status
        const status = STATUSES[(i + s) % STATUSES.length];

        // Pick session date: between -20 days and +10 days from now
        const dayOffset = (i % 30) - 15;
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + dayOffset);

        sessions.push({
          patientId: patient._id,
          doctorId: doctor._id,
          condition,
          sessionDate,
          appointmentAt,
          status,
          notes: `Routine clinical encounter for ${condition}. Doctor assigned: ${doctor.name}.`,
        });
      }
    }

    const createdSessions = await PatientSession.insertMany(sessions);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  seedDatabase();
}

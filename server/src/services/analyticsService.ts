import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { PatientSession } from '../models/PatientSession';

export const getAnalyticsSummaryFromDB = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Parallel KPI Counts
  const [
    totalDoctors,
    totalPatients,
    totalSessions,
    todaySessions,
    distinctActivePatients,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    PatientSession.countDocuments(),
    PatientSession.countDocuments({
      sessionDate: { $gte: todayStart, $lte: todayEnd },
    }),
    PatientSession.distinct('patientId', { status: { $in: ['active', 'scheduled'] } }),
  ]);

  const activePatientsCount = distinctActivePatients.length || totalPatients;
  const avgPerDoctor = totalDoctors > 0 ? (totalSessions / totalDoctors).toFixed(1) : '0';

  // 2. Caseload Distribution (Top doctors by active patient encounters)
  const caseloadDistribution = await PatientSession.aggregate([
    { $match: { status: { $in: ['active', 'scheduled'] } } },
    {
      $group: {
        _id: '$doctorId',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'doctors',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: '$doctor' },
    {
      $project: {
        _id: 1,
        doctorName: '$doctor.name',
        specialization: '$doctor.specialization',
        count: 1,
      },
    },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  // 3. Temporal Encounter Trends (Group sessions into daily buckets for Recharts)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const temporalTrends = await PatientSession.aggregate([
    { $match: { sessionDate: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$sessionDate' } },
        total: { $sum: 1 },
        consultations: {
          $sum: { $cond: [{ $in: ['$status', ['active', 'completed']] }, 1, 0] },
        },
        scheduled: {
          $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 14 },
  ]);

  return {
    kpis: {
      totalDoctors,
      totalPatients,
      activePatients: activePatientsCount,
      totalEncounters: totalSessions,
      todayScheduled: todaySessions,
      avgPerDoctor: parseFloat(avgPerDoctor),
    },
    caseloadDistribution,
    temporalTrends,
  };
};

export const AnalyticsService = {
  getAnalyticsSummaryFromDB,
};

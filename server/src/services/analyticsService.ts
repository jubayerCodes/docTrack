import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { PatientSession } from '../models/PatientSession';

export const getAnalyticsSummaryFromDB = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Execute all KPI counts and data visualization aggregations in parallel
  // This collapses 5 sequential database waterfalls into a single concurrent roundtrip.
  const [
    totalDoctors,
    totalPatients,
    totalSessions,
    todaySessions,
    distinctActivePatients,
    caseloadDistribution,
    temporalTrends,
    specializationDistribution,
    statusBreakdown,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    PatientSession.countDocuments(),
    PatientSession.countDocuments({
      sessionDate: { $gte: todayStart, $lte: todayEnd },
    }),
    PatientSession.distinct('patientId', { status: { $in: ['active', 'scheduled'] } }),

    // 1. Caseload Distribution (Top doctors by active patient encounters)
    PatientSession.aggregate([
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
    ]),

    // 2. Temporal Encounter Trends (Group sessions into daily buckets for Recharts)
    PatientSession.aggregate([
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
    ]),

    // 3. Specialization Breakdown
    Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),

    // 4. Encounter Status Breakdown
    PatientSession.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const activePatientsCount = distinctActivePatients.length || totalPatients;
  const avgPerDoctor = totalDoctors > 0 ? (totalSessions / totalDoctors).toFixed(1) : '0';

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
    specializationDistribution,
    statusBreakdown,
  };
};

export const AnalyticsService = {
  getAnalyticsSummaryFromDB,
};

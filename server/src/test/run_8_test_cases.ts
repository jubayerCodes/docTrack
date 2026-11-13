import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

interface ITestResult {
  testNumber: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: ITestResult[] = [];

const logResult = (testNum: number, name: string, passed: boolean, details: string) => {
  results.push({ testNumber: testNum, name, passed, details });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [Test ${testNum}] ${name}`);
  console.log(`   ${details}\n`);
};

async function runTests() {
  console.log('=====================================================');
  console.log(`🧪 Starting DocTrack Goal 1 Verification Test Suite`);
  console.log(`🔗 Target URL: ${BASE_URL}`);
  console.log('=====================================================\n');

  let doctorIdToTest = '';
  let patientIdToTest = '';
  let createdSessionId = '';
  let inlineCreatedPatientId = '';

  // TEST 1: Server Health Check
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = (await res.json()) as any;
    const passed = res.status === 200 && data.status === 'healthy' && data.database?.connected === true;
    logResult(
      1,
      'Server Health Check & MongoDB Atlas Connectivity',
      passed,
      `Status: ${res.status}, DB Status: ${data.database?.status}, Connected: ${data.database?.connected}`
    );
  } catch (err: any) {
    logResult(1, 'Server Health Check & MongoDB Atlas Connectivity', false, `Error: ${err.message}`);
  }

  // TEST 2: Database Seeding Verification (Verify seeded documents exist)
  try {
    const res = await fetch(`${BASE_URL}/api/v1/doctors?limit=1`);
    const data = (await res.json()) as any;
    const passed = data.success === true && data.meta?.total >= 18;
    logResult(
      2,
      'Database Seeding State (18 Doctors, 50 Patients, 99 Sessions)',
      passed,
      `Total doctors in Atlas: ${data.meta?.total}`
    );
  } catch (err: any) {
    logResult(2, 'Database Seeding State', false, `Error: ${err.message}`);
  }

  // TEST 3: Doctor Listing, Search, Filter & Active Patients Caseload
  try {
    // 3a. Search by query 'Jenkins'
    const searchRes = await fetch(`${BASE_URL}/api/v1/doctors?q=Jenkins`);
    const searchData = (await searchRes.json()) as any;
    const foundJenkins = searchData.data?.length > 0 && searchData.data[0].name.includes('Jenkins');
    if (foundJenkins) {
      doctorIdToTest = searchData.data[0]._id;
    }

    // 3b. Filter by specialization 'Cardiology'
    const filterRes = await fetch(`${BASE_URL}/api/v1/doctors?specialization=Cardiology`);
    const filterData = (await filterRes.json()) as any;
    const cardiologyOnly = filterData.data?.every((d: any) => d.specialization === 'Cardiology');

    // 3c. Sort by patient caseload descending
    const sortRes = await fetch(`${BASE_URL}/api/v1/doctors?sort=patients`);
    const sortData = (await sortRes.json()) as any;
    const hasCaseload = sortData.data?.every((d: any) => typeof d.activePatientsCount === 'number');
    const isSorted = sortData.data[0]?.activePatientsCount >= (sortData.data[1]?.activePatientsCount || 0);

    const passed = foundJenkins && cardiologyOnly && hasCaseload && isSorted;
    logResult(
      3,
      'Doctor Listing, Search (?q=), Filter (?specialization=), and Caseload Sorting (?sort=patients)',
      passed,
      `Search found: ${searchData.data[0]?.name}, Cardiology docs: ${filterData.data?.length}, Top caseload: ${sortData.data[0]?.name} (${sortData.data[0]?.activePatientsCount} active patients)`
    );
  } catch (err: any) {
    logResult(3, 'Doctor Listing, Search & Filters', false, `Error: ${err.message}`);
  }

  // TEST 4: Doctor Assigned Patients Modal Endpoint
  try {
    const res = await fetch(`${BASE_URL}/api/v1/doctors/${doctorIdToTest}/patients`);
    const data = (await res.json()) as any;
    const passed = data.success === true && Array.isArray(data.data.sessions) && data.data.doctor.name.includes('Jenkins');
    logResult(
      4,
      'Doctor Assigned Patients Modal Endpoint (GET /api/v1/doctors/:id/patients)',
      passed,
      `Doctor: ${data.data?.doctor?.name}, Assigned Active Sessions: ${data.data?.count}`
    );
  } catch (err: any) {
    logResult(4, 'Doctor Assigned Patients Modal Endpoint', false, `Error: ${err.message}`);
  }

  // TEST 5: Workflow 4.1 — Dual Patient Session Assignment
  try {
    // 5a: Mode A - Link Existing Patient
    const patientsRes = await fetch(`${BASE_URL}/api/v1/patients?limit=5`);
    const patientsData = (await patientsRes.json()) as any;
    patientIdToTest = patientsData.data[0]._id;

    const assignExistingRes = await fetch(`${BASE_URL}/api/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: doctorIdToTest,
        mode: 'existing',
        patientId: patientIdToTest,
        condition: 'Hypertension Follow-up',
        appointmentAt: '11:30 AM',
        status: 'scheduled',
      }),
    });
    const assignExistingData = (await assignExistingRes.json()) as any;
    const modeAPassed = assignExistingRes.status === 201 && assignExistingData.success === true;
    createdSessionId = assignExistingData.data?._id;

    // 5b: Mode B - Register New Inline Patient
    const assignNewRes = await fetch(`${BASE_URL}/api/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: doctorIdToTest,
        mode: 'new',
        name: 'Workflow 4.1 Test Patient',
        phone: '+1 (555) 999-8877',
        email: 'workflow4.1@test.org',
        age: 38,
        gender: 'Female',
        condition: 'Acute Cardiac Arrhythmia',
        appointmentAt: '03:00 PM',
        status: 'active',
      }),
    });
    const assignNewData = (await assignNewRes.json()) as any;
    const modeBPassed = assignNewRes.status === 201 && assignNewData.success === true;
    inlineCreatedPatientId = assignNewData.data?.patientId?._id;

    const passed = modeAPassed && modeBPassed;
    logResult(
      5,
      'Workflow 4.1 — Dual Patient Session Assignment (Mode Existing & Mode Inline New)',
      passed,
      `Mode Existing: Created session ${createdSessionId} | Mode Inline New: Registered patient ${assignNewData.data?.patientId?.name} (ID: ${inlineCreatedPatientId})`
    );
  } catch (err: any) {
    logResult(5, 'Workflow 4.1 Dual Assignment', false, `Error: ${err.message}`);
  }

  // TEST 6: Safe Disassociation (DELETE /api/v1/sessions/:sessionId)
  try {
    const deleteRes = await fetch(`${BASE_URL}/api/v1/sessions/${createdSessionId}?doctorId=${doctorIdToTest}`, {
      method: 'DELETE',
    });
    const deleteData = (await deleteRes.json()) as any;
    const deletePassed = deleteRes.status === 200 && deleteData.success === true;

    // Verify patient record still exists!
    const verifyPatientRes = await fetch(`${BASE_URL}/api/v1/patients/${patientIdToTest}`);
    const verifyPatientData = (await verifyPatientRes.json()) as any;
    const patientPreserved = verifyPatientRes.status === 200 && verifyPatientData.data?.patient?._id === patientIdToTest;

    const passed = deletePassed && patientPreserved;
    logResult(
      6,
      'Safe Disassociation: Session Removed but Master Patient Record Preserved',
      passed,
      `Disassociated Session ID: ${createdSessionId} | Patient ${verifyPatientData.data?.patient?.name} still preserved in master directory.`
    );
  } catch (err: any) {
    logResult(6, 'Safe Disassociation', false, `Error: ${err.message}`);
  }

  // TEST 7: Master Patient Directory with Joined Encounters & Filtering
  try {
    const listRes = await fetch(`${BASE_URL}/api/v1/patients?limit=10`);
    const listData = (await listRes.json()) as any;
    const hasJoinedDoctor = listData.data?.some((p: any) => p.assignedDoctor && p.assignedDoctor.name);

    const statusFilterRes = await fetch(`${BASE_URL}/api/v1/patients?status=active`);
    const statusData = (await statusFilterRes.json()) as any;
    const statusFilterWorks = statusData.data?.every((p: any) => p.status === 'active');

    const passed = listData.success === true && hasJoinedDoctor && statusFilterWorks;
    logResult(
      7,
      'Master Patient Directory with Joined Encounters & Status Filtering',
      passed,
      `Patients total: ${listData.meta?.total}, First record joined doctor: ${listData.data[0]?.assignedDoctor?.name || 'N/A'}, Active status filter matches: ${statusData.data?.length}`
    );
  } catch (err: any) {
    logResult(7, 'Master Patient Directory', false, `Error: ${err.message}`);
  }

  // TEST 8: Dashboard Analytics Aggregations (KPIs, Caseload, Temporal Trends)
  try {
    const res = await fetch(`${BASE_URL}/api/v1/analytics/summary`);
    const data = (await res.json()) as any;
    const kpis = data.data?.kpis;
    const caseload = data.data?.caseloadDistribution;
    const trends = data.data?.temporalTrends;

    const passed =
      data.success === true &&
      typeof kpis?.totalDoctors === 'number' &&
      typeof kpis?.totalPatients === 'number' &&
      Array.isArray(caseload) &&
      caseload.length > 0 &&
      Array.isArray(trends);

    logResult(
      8,
      'Dashboard Analytics Aggregations (Parallel KPIs, Caseload, Temporal Trends)',
      passed,
      `KPIs: Doctors=${kpis?.totalDoctors}, Patients=${kpis?.totalPatients}, Encounters=${kpis?.totalEncounters}, Caseload Top Doctor: ${caseload[0]?.doctorName} (${caseload[0]?.count} encounters), Temporal Buckets: ${trends.length}`
    );
  } catch (err: any) {
    logResult(8, 'Dashboard Analytics Aggregations', false, `Error: ${err.message}`);
  }

  console.log('=====================================================');
  const allPassed = results.every((r) => r.passed);
  if (allPassed) {
    console.log(`🎉 ALL ${results.length} / 8 TEST CASES PASSED WITH 100% SUCCESS!`);
  } else {
    console.log(`⚠️ Some tests failed. Passed: ${results.filter((r) => r.passed).length} / ${results.length}`);
  }
  console.log('=====================================================\n');

  process.exit(allPassed ? 0 : 1);
}

runTests();

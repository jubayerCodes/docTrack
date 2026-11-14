import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { createApp } from '../app';
import { supabase } from '../config/supabase';

async function runRbacTests() {
  console.log('=====================================================');
  console.log('🧪 Starting Auth & RBAC API Authorization Test Suite');
  console.log('=====================================================\n');

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctrack';
  await mongoose.connect(mongoURI);

  const app = createApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api/v1`;

  let testPassed = 0;
  let testFailed = 0;

  const assert = (name: string, condition: boolean, details?: string) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      if (details) console.log(`   ${details}`);
      testPassed++;
    } else {
      console.error(`❌ FAIL: ${name}`);
      if (details) console.error(`   ${details}`);
      testFailed++;
    }
  };

  try {
    const timestamp = Date.now();
    const testEmail = `testuser_${timestamp}@example.com`;
    const testPassword = 'Password123!';
    const testName = 'Dr. Test Assistant';
    let testUserId = '';

    // Test 1: Register new user via POST /api/v1/auth/register
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName,
      }),
    });
    const regData = (await regRes.json()) as any;
    assert(
      'User Registration API (POST /auth/register)',
      regRes.status === 201 && regData.success === true && regData.data?.role === 'user',
      `Status: ${regRes.status}, Created User ID: ${regData.data?.id}, Role: ${regData.data?.role}`
    );
    testUserId = regData.data?.id;

    // Test 2: Duplicate email registration returns 400
    const dupRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName,
      }),
    });
    assert(
      'Duplicate Email Rejection (400 Bad Request)',
      dupRes.status === 400,
      `Status: ${dupRes.status}`
    );

    // Test 3: Authenticate the new regular user with Supabase to get an access token
    const { data: userAuth, error: authErr } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    assert(
      'Normal User Login via Supabase',
      !authErr && !!userAuth.session?.access_token,
      authErr ? `Auth error: ${authErr.message}` : `Token obtained`
    );
    const userToken = userAuth.session?.access_token || '';

    // Test 4: Normal user trying to access /doctors -> 403 Forbidden
    const docRes = await fetch(`${baseUrl}/doctors`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      'RBAC: Normal user blocked from GET /doctors (403 Forbidden)',
      docRes.status === 403,
      `Status: ${docRes.status}`
    );

    // Test 5: Normal user trying to access /patients -> 403 Forbidden
    const patRes = await fetch(`${baseUrl}/patients`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      'RBAC: Normal user blocked from GET /patients (403 Forbidden)',
      patRes.status === 403,
      `Status: ${patRes.status}`
    );

    // Test 6: Normal user trying to access /sessions -> 403 Forbidden
    const sessRes = await fetch(`${baseUrl}/sessions`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      'RBAC: Normal user blocked from GET /sessions (403 Forbidden)',
      sessRes.status === 403,
      `Status: ${sessRes.status}`
    );

    // Test 7: Normal user trying to access /users -> 403 Forbidden
    const userRes = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      'RBAC: Normal user blocked from GET /users (403 Forbidden)',
      userRes.status === 403,
      `Status: ${userRes.status}`
    );

    // Test 8: Normal user CAN access dashboard analytics (/analytics/summary) -> 200 OK
    const analyticsRes = await fetch(`${baseUrl}/analytics/summary`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const analyticsData = (await analyticsRes.json()) as any;
    assert(
      'RBAC: Normal user CAN access dashboard analytics (/analytics/summary)',
      analyticsRes.status === 200 && analyticsData.success === true,
      `Status: ${analyticsRes.status}, Total Doctors: ${analyticsData.data?.kpis?.totalDoctors}`
    );

    // Test 9: Sign in as Admin
    const { data: adminAuth, error: adminAuthErr } = await supabase.auth.signInWithPassword({
      email: 'admin@doctrack.com',
      password: 'Password123!',
    });
    assert(
      'Admin Authentication via Supabase',
      !adminAuthErr && !!adminAuth.session?.access_token,
      adminAuthErr ? `Admin error: ${adminAuthErr.message}` : `Admin Token obtained`
    );
    const adminToken = adminAuth.session?.access_token || '';

    // Test 10: Admin CAN access /users -> 200 OK
    const adminUsersRes = await fetch(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminUsersData = (await adminUsersRes.json()) as any;
    assert(
      'Admin Access: GET /users returns user list (200 OK)',
      adminUsersRes.status === 200 && Array.isArray(adminUsersData.data),
      `Status: ${adminUsersRes.status}, Users Count: ${adminUsersData.data?.length}`
    );

    // Test 11: Admin promotes test user to admin
    const promoteRes = await fetch(`${baseUrl}/users/${testUserId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ role: 'admin' }),
    });
    const promoteData = (await promoteRes.json()) as any;
    assert(
      'Admin promotes user to admin (PATCH /users/:id/role)',
      promoteRes.status === 200 && promoteData.data?.role === 'admin',
      `Status: ${promoteRes.status}, New Role: ${promoteData.data?.role}`
    );

    // Test 12: Admin demotes user back to user
    const demoteRes = await fetch(`${baseUrl}/users/${testUserId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ role: 'user' }),
    });
    const demoteData = (await demoteRes.json()) as any;
    assert(
      'Admin demotes user to regular user (PATCH /users/:id/role)',
      demoteRes.status === 200 && demoteData.data?.role === 'user',
      `Status: ${demoteRes.status}, New Role: ${demoteData.data?.role}`
    );

    // Test 13: Admin self-demotion prevention
    const selfDemoteRes = await fetch(`${baseUrl}/users/${adminAuth.user?.id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ role: 'user' }),
    });
    assert(
      'Security: Prevent admin from demoting themselves (400 Bad Request)',
      selfDemoteRes.status === 400,
      `Status: ${selfDemoteRes.status}`
    );

    // Test 14: Admin self-deletion prevention
    const selfDelRes = await fetch(`${baseUrl}/users/${adminAuth.user?.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      'Security: Prevent admin from deleting themselves (400 Bad Request)',
      selfDelRes.status === 400,
      `Status: ${selfDelRes.status}`
    );

    // Test 15: Admin deletes the test user account
    const delRes = await fetch(`${baseUrl}/users/${testUserId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      'Admin deletes user account (DELETE /users/:id)',
      delRes.status === 200,
      `Status: ${delRes.status}`
    );

  } catch (err: any) {
    console.error('Unexpected test runner failure:', err);
    testFailed++;
  } finally {
    server.close();
    await mongoose.disconnect();
    console.log('\n=====================================================');
    console.log(`Summary: ${testPassed} Passed, ${testFailed} Failed`);
    console.log('=====================================================');
    process.exit(testFailed > 0 ? 1 : 0);
  }
}

runRbacTests();

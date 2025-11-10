import 'dotenv/config';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const API_VERSION = 'v1';
const API_BASE = `${BASE_URL}/api/${API_VERSION}`;

interface TestResult {
  name: string;
  success: boolean;
  status?: number;
  data?: any;
  error?: string;
}

const results: TestResult[] = [];

// Helper function to make HTTP requests
async function makeRequest(
  method: string,
  url: string,
  token?: string,
  body?: any
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  
  return {
    status: response.status,
    data,
  };
}

// Test 1: Check server health
async function testServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    results.push({
      name: 'Server Health Check',
      success: response.ok && data.status === 'ok',
      status: response.status,
      data,
    });
    return response.ok;
  } catch (error: any) {
    results.push({
      name: 'Server Health Check',
      success: false,
      error: error.message,
    });
    return false;
  }
}

// Test 2: Register user
async function registerUser(): Promise<{ token: string; userId: string } | null> {
  const username = `testuser_${Date.now()}`;
  const password = 'testpass123';
  
  try {
    const { status, data } = await makeRequest('POST', `${API_BASE}/auth/register`, undefined, {
      username,
      password,
      email: `${username}@test.com`,
    });

    if (status === 201 || status === 200) {
      results.push({
        name: 'Register User',
        success: true,
        status,
        data: { username, token: data.data?.token ? '***' : 'No token in response' },
      });
      
      // If registration returns token, use it; otherwise login
      if (data.data?.token) {
        return { token: data.data.token, userId: data.data.user?.id || 'unknown' };
      }
    } else {
      results.push({
        name: 'Register User',
        success: false,
        status,
        data,
      });
    }

    // Try to login
    return await loginUser(username, password);
  } catch (error: any) {
    results.push({
      name: 'Register User',
      success: false,
      error: error.message,
    });
    return null;
  }
}

// Test 3: Login user
async function loginUser(username: string, password: string): Promise<{ token: string; userId: string } | null> {
  try {
    const { status, data } = await makeRequest('POST', `${API_BASE}/auth/login`, undefined, {
      username,
      password,
    });

    if (status === 200 && data.data?.token) {
      results.push({
        name: 'Login User',
        success: true,
        status,
        data: { username, token: '***' },
      });
      return {
        token: data.data.token,
        userId: data.data.user?.id || 'unknown',
      };
    } else {
      results.push({
        name: 'Login User',
        success: false,
        status,
        data,
      });
      return null;
    }
  } catch (error: any) {
    results.push({
      name: 'Login User',
      success: false,
      error: error.message,
    });
    return null;
  }
}

// Test 4: Create patient
async function createPatient(token: string): Promise<string | null> {
  const patientId = `P${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
  
  try {
    const { status, data } = await makeRequest(
      'POST',
      `${API_BASE}/patients`,
      token,
      {
        patientId,
        name: 'Test Patient',
        age: 35,
        sex: 'Male',
        patientMobile: `01${Math.floor(Math.random() * 900000000) + 100000000}`,
      }
    );

    if (status === 201 || status === 200) {
      const patientUuid = data.data?.id;
      results.push({
        name: 'Create Patient',
        success: !!patientUuid,
        status,
        data: { patientId, uuid: patientUuid },
      });
      return patientUuid;
    } else {
      results.push({
        name: 'Create Patient',
        success: false,
        status,
        data,
      });
      return null;
    }
  } catch (error: any) {
    results.push({
      name: 'Create Patient',
      success: false,
      error: error.message,
    });
    return null;
  }
}

// Test 5: Create Investigation
async function createInvestigation(
  token: string,
  patientId: string
): Promise<string | null> {
  try {
    const investigationData = {
      patientId,
      investigationDate: '2025-11-09',
      hematology: [
        {
          testName: 'Hemoglobin',
          value: '14.5',
          unit: 'g/dL',
        },
        {
          testName: 'WBC',
          value: '8500',
          unit: '/cumm',
        },
      ],
      lft: [
        {
          testName: 'SGPT',
          value: '35',
          unit: 'U/L',
          testMethod: 'IFCC',
        },
      ],
      rft: [
        {
          testName: 'Creatinine',
          value: '1.0',
          unit: 'mg/dL',
        },
      ],
    };

    const { status, data } = await makeRequest(
      'POST',
      `${API_BASE}/investigations`,
      token,
      investigationData
    );

    if (status === 201 || status === 200) {
      const investigationId = data.data?.session?.id;
      results.push({
        name: 'Create Investigation',
        success: !!investigationId,
        status,
        data: {
          investigationId,
          hematologyCount: data.data?.hematology?.length || 0,
          lftCount: data.data?.lft?.length || 0,
          rftCount: data.data?.rft?.length || 0,
        },
      });
      return investigationId;
    } else {
      results.push({
        name: 'Create Investigation',
        success: false,
        status,
        data,
      });
      return null;
    }
  } catch (error: any) {
    results.push({
      name: 'Create Investigation',
      success: false,
      error: error.message,
    });
    return null;
  }
}

// Test 6: Get Investigation
async function getInvestigation(token: string, investigationId: string): Promise<boolean> {
  try {
    const { status, data } = await makeRequest(
      'GET',
      `${API_BASE}/investigations/${investigationId}`,
      token
    );

    if (status === 200 && data.data?.session) {
      results.push({
        name: 'Get Investigation',
        success: true,
        status,
        data: {
          investigationId: data.data.session.id,
          patientId: data.data.session.patientId,
          hematologyCount: data.data?.hematology?.length || 0,
          lftCount: data.data?.lft?.length || 0,
          rftCount: data.data?.rft?.length || 0,
        },
      });
      return true;
    } else {
      results.push({
        name: 'Get Investigation',
        success: false,
        status,
        data,
      });
      return false;
    }
  } catch (error: any) {
    results.push({
      name: 'Get Investigation',
      success: false,
      error: error.message,
    });
    return false;
  }
}

// Test 7: List Patient Investigations
async function listPatientInvestigations(token: string, patientId: string): Promise<boolean> {
  try {
    const { status, data } = await makeRequest(
      'GET',
      `${API_BASE}/investigations/patient/${patientId}`,
      token
    );

    if (status === 200 && Array.isArray(data.data)) {
      results.push({
        name: 'List Patient Investigations',
        success: true,
        status,
        data: {
          count: data.data.length,
          pagination: data.pagination,
        },
      });
      return true;
    } else {
      results.push({
        name: 'List Patient Investigations',
        success: false,
        status,
        data,
      });
      return false;
    }
  } catch (error: any) {
    results.push({
      name: 'List Patient Investigations',
      success: false,
      error: error.message,
    });
    return false;
  }
}

// Test 8: Delete Investigation
async function deleteInvestigation(token: string, investigationId: string): Promise<boolean> {
  try {
    const { status, data } = await makeRequest(
      'DELETE',
      `${API_BASE}/investigations/${investigationId}`,
      token
    );

    if (status === 200) {
      results.push({
        name: 'Delete Investigation',
        success: true,
        status,
        data,
      });
      return true;
    } else {
      results.push({
        name: 'Delete Investigation',
        success: false,
        status,
        data,
      });
      return false;
    }
  } catch (error: any) {
    results.push({
      name: 'Delete Investigation',
      success: false,
      error: error.message,
    });
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Investigation API Tests...\n');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`🔗 API Base: ${API_BASE}\n`);

  // Test 1: Server Health
  console.log('1️⃣  Testing server health...');
  const serverOk = await testServerHealth();
  if (!serverOk) {
    console.error('❌ Server is not responding. Please make sure the server is running on port 3000.');
    console.error('   Run: npm run dev');
    process.exit(1);
  }
  console.log('✅ Server is running\n');

  // Test 2: Register/Login
  console.log('2️⃣  Registering/Logging in user...');
  const auth = await registerUser();
  if (!auth) {
    console.error('❌ Failed to authenticate. Cannot continue tests.');
    printResults();
    process.exit(1);
  }
  console.log('✅ Authentication successful\n');

  // Test 3: Create Patient
  console.log('3️⃣  Creating test patient...');
  const patientId = await createPatient(auth.token);
  if (!patientId) {
    console.error('❌ Failed to create patient. Cannot continue tests.');
    printResults();
    process.exit(1);
  }
  console.log(`✅ Patient created: ${patientId}\n`);

  // Test 4: Create Investigation
  console.log('4️⃣  Creating investigation...');
  const investigationId = await createInvestigation(auth.token, patientId);
  if (!investigationId) {
    console.error('❌ Failed to create investigation. Cannot continue tests.');
    printResults();
    process.exit(1);
  }
  console.log(`✅ Investigation created: ${investigationId}\n`);

  // Test 5: Get Investigation
  console.log('5️⃣  Getting investigation...');
  await getInvestigation(auth.token, investigationId);
  console.log('✅ Get investigation completed\n');

  // Test 6: List Patient Investigations
  console.log('6️⃣  Listing patient investigations...');
  await listPatientInvestigations(auth.token, patientId);
  console.log('✅ List investigations completed\n');

  // Test 7: Delete Investigation
  console.log('7️⃣  Deleting investigation...');
  await deleteInvestigation(auth.token, investigationId);
  console.log('✅ Delete investigation completed\n');

  // Print summary
  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60) + '\n');

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.name}`);
    if (result.status) {
      console.log(`   Status: ${result.status}`);
    }
    if (result.data) {
      console.log(`   Data: ${JSON.stringify(result.data, null, 2).replace(/\n/g, '\n   ')}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log();
  });

  console.log('='.repeat(60));
  console.log(`📈 Success Rate: ${successCount}/${totalCount} (${Math.round((successCount / totalCount) * 100)}%)`);
  console.log('='.repeat(60) + '\n');

  if (successCount === totalCount) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the results above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});


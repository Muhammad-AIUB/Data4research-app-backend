import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000/api/v1';
const username = 'doctor123';
const password = 'password123';

async function login() {
  const res = await axios.post(`${BASE_URL}/auth/login`, { username, password });
  return res.data.data.token as string;
}

async function ensurePatient(token: string): Promise<string> {
  const list = await axios.get(`${BASE_URL}/patients`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 1, limit: 1 }
  });
  if (list.data.data?.length) {
    return list.data.data[0].id;
  }
  const create = await axios.post(`${BASE_URL}/patients`, {
    patientId: `PX-${Date.now()}`,
    name: 'Image Test Patient',
    age: 35,
    sex: 'Male'
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return create.data.data.id;
}

function ensurePng(): string {
  const filePath = path.join(__dirname, 'tiny.png');
  if (!fs.existsSync(filePath)) {
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAQAAAC1HAwCAAAADUlEQVR42mP8/5+BAQAEgwJ/2rQmXQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(filePath, buffer);
  }
  return filePath;
}

async function uploadPatientImage(token: string, patientId: string, filePath: string) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));
  form.append('description', 'X-Ray chest PA view');

  const res = await axios.post(`${BASE_URL}/images/patient/${patientId}`, form, {
    headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

async function listPatientImages(token: string, patientId: string) {
  const res = await axios.get(`${BASE_URL}/images/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

async function ensureInvestigation(token: string, patientId: string): Promise<string> {
  const res = await axios.get(`${BASE_URL}/investigations/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page: 1, limit: 1 }
  });
  if (res.data.data?.length) {
    return res.data.data[0].id;
  }
  const create = await axios.post(`${BASE_URL}/investigations`, {
    patientId,
    investigationDate: new Date().toISOString().substring(0, 10),
    hematology: [{ testName: 'HB', value: '14' }]
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return create.data.data.session.id;
}

async function uploadInvestigationImage(token: string, investigationId: string, filePath: string) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));
  form.append('description', 'Blood test report');

  const res = await axios.post(`${BASE_URL}/images/investigation/${investigationId}`, form, {
    headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

async function deletePatientImage(token: string, imageId: string) {
  const res = await axios.delete(`${BASE_URL}/images/patient/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.success;
}

async function verifyStatic(pathFragment: string) {
  const res = await axios.get(`http://localhost:3000/api/v1${pathFragment}`, {
    responseType: 'arraybuffer'
  });
  return res.status;
}

async function main() {
  try {
    const token = await login();
    console.log('Login OK');

    const patientId = await ensurePatient(token);
    console.log('Patient ID:', patientId);

    const filePath = ensurePng();

    const patientImage = await uploadPatientImage(token, patientId, filePath);
    console.log('Uploaded patient image:', patientImage.id, patientImage.imagePath);

    const patientImages = await listPatientImages(token, patientId);
    console.log('Patient images count:', patientImages.length);

    const investigationId = await ensureInvestigation(token, patientId);
    console.log('Investigation ID:', investigationId);

    const invImage = await uploadInvestigationImage(token, investigationId, filePath);
    console.log('Uploaded investigation image:', invImage.id, invImage.imagePath);

    const staticStatus = await verifyStatic(patientImage.imagePath);
    console.log('Static fetch status:', staticStatus);

    const deleted = await deletePatientImage(token, patientImage.id);
    console.log('Deleted patient image:', deleted);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Request failed:', error.response?.status, error.response?.data);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main();

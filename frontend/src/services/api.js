import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return await axios.post(`${API_BASE_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generatePaper = async (config) => {
  return await axios.post(`${API_BASE_URL}/api/generate`, config);
};

export const getSubjects = async () => {
  // Changed from /upload/subjects to /generate/subjects
  return await axios.get(`${API_BASE_URL}/api/generate/subjects`);
};
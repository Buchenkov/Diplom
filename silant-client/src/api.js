import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для автоматического добавления токена в заголовки
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;


export const addMachine = async (newData) => {
  const response = await fetch('/api/machines', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  });

  if (!response.ok) {
    throw new Error('Ошибка при добавлении машины');
  }

  return response.json();
};

export const updateMachine = async (updatedData) => {
  const response = await fetch(`/api/machines/${updatedData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Ошибка при обновлении машины');
  }

  return response.json();
};
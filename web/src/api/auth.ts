import api from './axios';

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password }).then((r) => r.data);

export const getProfile = () => api.get('/auth/profile').then((r) => r.data);

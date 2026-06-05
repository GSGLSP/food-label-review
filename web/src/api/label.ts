import api from './axios';

export const uploadLabel = (formData: FormData) =>
  api.post('/labels/upload', formData).then((r) => r.data);

export const getLabels = (params?: { status?: string; foodType?: string }) =>
  api.get('/labels', { params }).then((r) => r.data);

export const getLabel = (id: number) => api.get(`/labels/${id}`).then((r) => r.data);

export const triggerOcr = (id: number) => api.post(`/labels/${id}/ocr`).then((r) => r.data);

export const getOcrResult = (id: number) => api.get(`/labels/${id}/ocr/result`).then((r) => r.data);

import api from './axios';

export const createReview = (labelId: number, reviewerId?: number) =>
  api.post('/reviews', { labelId, reviewerId }).then((r) => r.data);

export const getReviews = (params?: { status?: string; foodType?: string }) =>
  api.get('/reviews', { params }).then((r) => r.data);

export const getReview = (id: number) => api.get(`/reviews/${id}`).then((r) => r.data);

export const updateReviewItem = (reviewId: number, itemId: number, data: { result: string; issue?: string; suggestion?: string }) =>
  api.put(`/reviews/${reviewId}/items/${itemId}`, data).then((r) => r.data);

export const submitReview = (reviewId: number, overallResult: string) =>
  api.put(`/reviews/${reviewId}/submit`, { overallResult }).then((r) => r.data);

export const generateReport = (reviewId: number) =>
  api.post(`/reports/reviews/${reviewId}/generate`).then((r) => r.data);

export const getReports = () => api.get('/reports').then((r) => r.data);

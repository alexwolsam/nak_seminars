import axios from "axios";

// Basis-URL zum Gateway
const api = axios.create({
  baseURL: "http://localhost:8081",
});

// Token automatisch setzen
export function setAuthToken(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function fetchSeminars() {
  const response = await api.get("/seminars");
  return response.data;
}

export async function fetchNotifications() {
  const response = await api.get("/notifications");
  return response.data;
}

export async function fetchEnrollments() {
  const response = await api.get("/seminars/enrollments/mine");
  return response.data;
}

export async function enrollUser(seminarId: string) {
  const response = await api.post(`/seminars/enrollments/${seminarId}`);
  return response.data;
}

export async function unenrollUser(seminarId: string) {
  const response = await api.delete(`/seminars/enrollments/${seminarId}`);
  return response.data;
}

export async function createSeminar(seminar: {
  title: string;
  available: number;
  deadline: string;
}) {
  const response = await api.post("/seminars", seminar);
  return response.data;
}

export async function updateSeminar(
  id: number,
  seminar: { title: string; available: number; deadline: string }
) {
  const response = await api.put(`/seminars/${id}`, seminar);
  return response.data;
}

export async function deleteSeminar(id: number) {
  const response = await api.delete(`/seminars/${id}`);
  return response.data;
}

export default api;

import api from "./api";

export const getReportRequest = async (interviewId) => {
  const { data } = await api.get(`/interviews/${interviewId}/report`);
  return data;
};

export const getPrintableReportUrl = (interviewId) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return `${baseUrl}/interviews/${interviewId}/report/html`;
};

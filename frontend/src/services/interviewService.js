import api from "./api";

export const createInterviewRequest = async (payload) => {
  const { data } = await api.post("/interviews", payload);
  return data;
};

export const getInterviewsRequest = async (params = {}) => {
  const { data } = await api.get("/interviews", { params });
  return data;
};

export const getInterviewByIdRequest = async (id) => {
  const { data } = await api.get(`/interviews/${id}`);
  return data;
};

export const startInterviewRequest = async (id) => {
  const { data } = await api.post(`/interviews/${id}/start`);
  return data;
};

export const submitAnswerRequest = async (id, payload) => {
  const { data } = await api.post(`/interviews/${id}/answers`, payload);
  return data;
};

export const nextQuestionRequest = async (id) => {
  const { data } = await api.post(`/interviews/${id}/next-question`);
  return data;
};

export const completeInterviewRequest = async (id) => {
  const { data } = await api.post(`/interviews/${id}/complete`);
  return data;
};

export const abandonInterviewRequest = async (id) => {
  const { data } = await api.post(`/interviews/${id}/abandon`);
  return data;
};

export const getInterviewEvaluationsRequest = async (id) => {
  const { data } = await api.get(`/interviews/${id}/evaluations`);
  return data;
};

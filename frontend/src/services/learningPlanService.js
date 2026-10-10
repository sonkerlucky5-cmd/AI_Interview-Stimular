import api from "./api";

export const getLearningPlansRequest = async () => {
  const { data } = await api.get("/learning-plans");
  return data;
};

export const getLearningPlanRequest = async (id) => {
  const { data } = await api.get(`/learning-plans/${id}`);
  return data;
};

export const createLearningPlanRequest = async (payload) => {
  const { data } = await api.post("/learning-plans", payload);
  return data;
};

export const updateLearningPlanRequest = async (id, payload) => {
  const { data } = await api.patch(`/learning-plans/${id}`, payload);
  return data;
};

export const deleteLearningPlanRequest = async (id) => {
  const { data } = await api.delete(`/learning-plans/${id}`);
  return data;
};

export const updateLearningPlanItemRequest = async (planId, itemId, payload) => {
  const { data } = await api.patch(`/learning-plans/${planId}/items/${itemId}`, payload);
  return data;
};

export const addLearningPlanItemRequest = async (planId, payload) => {
  const { data } = await api.post(`/learning-plans/${planId}/items`, payload);
  return data;
};

export const deleteLearningPlanItemRequest = async (planId, itemId) => {
  const { data } = await api.delete(`/learning-plans/${planId}/items/${itemId}`);
  return data;
};

export const regenerateLearningPlanRequest = async (planId, payload = {}) => {
  const { data } = await api.post(`/learning-plans/${planId}/regenerate`, payload);
  return data;
};

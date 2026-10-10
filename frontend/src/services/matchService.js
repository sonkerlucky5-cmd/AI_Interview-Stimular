import api from "./api";

export const createMatchRequest = async (payload) => {
  const { data } = await api.post("/resume-matches", payload);
  return data;
};

export const getMatchesRequest = async () => {
  const { data } = await api.get("/resume-matches");
  return data;
};

export const getMatchByIdRequest = async (id) => {
  const { data } = await api.get(`/resume-matches/${id}`);
  return data;
};

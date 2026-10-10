import api from "./api";

export const getAnalyticsOverviewRequest = async () => {
  const { data } = await api.get("/analytics/overview");
  return data;
};

export const getSkillsAnalyticsRequest = async () => {
  const { data } = await api.get("/analytics/skills");
  return data;
};

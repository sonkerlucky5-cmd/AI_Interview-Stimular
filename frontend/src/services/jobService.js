import api from "./api";

export const createJobRequest = async (payload) => {
  const { data } = await api.post("/job-descriptions", payload);
  return data;
};

export const getJobsRequest = async () => {
  const { data } = await api.get("/job-descriptions");
  return data;
};

export const getJobByIdRequest = async (id) => {
  const { data } = await api.get(`/job-descriptions/${id}`);
  return data;
};

export const updateJobRequest = async (id, payload) => {
  const { data } = await api.patch(`/job-descriptions/${id}`, payload);
  return data;
};

export const deleteJobRequest = async (id) => {
  const { data } = await api.delete(`/job-descriptions/${id}`);
  return data;
};

import api from "./api";

export const getDsaProblemsRequest = async () => {
  const { data } = await api.get("/dsa/problems");
  return data.data;
};

export const submitDsaCodeRequest = async (payload) => {
  const { data } = await api.post("/dsa/submit", payload);
  return data.data;
};

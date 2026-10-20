import api from "./api";

export const signupRequest = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const logoutRequest = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getProfileRequest = async () => {
  const { data } = await api.get("/auth/profile");
  return data;
};

export const updateProfileRequest = async (payload) => {
  const { data } = await api.patch("/auth/profile", payload);
  return data;
};

import api from "./api";

export const uploadResumeRequest = async (formData, onUploadProgress) => {
  const { data } = await api.post("/resumes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return data;
};

export const getResumesRequest = async () => {
  const { data } = await api.get("/resumes");
  return data;
};

export const getResumeByIdRequest = async (id) => {
  const { data } = await api.get(`/resumes/${id}`);
  return data;
};

export const deleteResumeRequest = async (id) => {
  const { data } = await api.delete(`/resumes/${id}`);
  return data;
};

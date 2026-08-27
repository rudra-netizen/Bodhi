import api from "./api";

export const getChats = async () => {
  const response = await api.get("/api/chat");

  return response.data;
};

export const createChat = async (title) => {
  const response = await api.post("/api/chat", {
    title,
  });

  return response.data;
};

export const getChat = async (chatId) => {
  const response = await api.get(`/api/chat/${chatId}`);

  return response.data;
};

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: (path) => instance.get(path).then((res) => res.data),
  post: (path, body) => instance.post(path, body).then((res) => res.data),
};
const env = {
  VITE_API_URL: "http://localhost:8000/api",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
};

export default env;

// // axiosInstance.js
// import axios from "axios";

// // const apiUrl = process.env.REACT_APP_API_URL;

// const axiosInstance = axios.create({
//   baseURL: "https://fakestoreapi.com",
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;

import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    // const accessTokens = window.localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["accessToken"] = accessToken; // Send only the token
    }
    return config;
  },
  (error) => {
    console.error("❌ Axios Request Error:", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;

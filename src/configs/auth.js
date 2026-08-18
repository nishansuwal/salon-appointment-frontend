const apiUrl = import.meta.env.VITE_API_URL;

export default {
  meEndpoint: apiUrl + "/authenticate",
  loginEndpoint: apiUrl + "/login",
  refreshEndpoint: apiUrl + "/admin/refersh",
  registerEndpoint: "/jwt/register",
  storageTokenKeyName: "accessToken",
  onTokenExpiration: "refreshToken", // logout | refreshToken
};

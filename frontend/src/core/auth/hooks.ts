export const useAuth = () => {
  const accessToken = sessionStorage.getItem("accessToken");

  return { isAuthenticated: Boolean(accessToken), accessToken };
};

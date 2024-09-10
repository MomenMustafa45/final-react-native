export const useAuth = () => {
  const userId = localStorage.getItem("userId");

  if (userId) {
    return userId;
  } else {
    return false;
  }
};

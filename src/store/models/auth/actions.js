export const setToken = (payload) => {
  return {
    type: "SET_TOKEN",
    payload,
  };
};

export const setUser = (payload) => {
  return {
    type: "SET_USER",
    payload,
  };
};

export const resetReducer = (payload) => {
  return {
    type: "RESET_REDUCER",
    payload,
  };
};

export const setUserId = (payload) => {
  return {
    type: "SET_USER_ID",
    payload,
  };
};

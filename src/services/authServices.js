import { useDispatch } from "react-redux";
import API from "../utils/apiService";
import { setToken } from "../store/models/auth/actions";

export const ApiToken = async (username, password, installationId) => {
  const userdata = {
    username: username,
    password: password,
    installationId: installationId,
  };
  const token = API.Login("api/auth/authMobileApp")(userdata).then((result) => {
    return result.data.message;
  });
  return token;
};

export const LoginAPI = async (username, password, installationId) => {
  const token = await ApiToken(username, password, installationId);
  console.log("i am loginbyauth :", token);

  //   localStorage.setItem('token', token);

  return token;
};

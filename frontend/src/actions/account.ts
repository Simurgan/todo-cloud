import { useStore } from "../store/store";
import { api } from "./api";
import { requestAuthorizationInterceptor } from "./interceptors";

const accountApi = api.create({
  baseURL: api.defaults.baseURL + "account/",
});

accountApi.interceptors.request.use(requestAuthorizationInterceptor);

export const getUserIdentity = async () => {
  const response = await accountApi({
    method: "get",
  });

  if (response.status === 200) {
    useStore.getState().setUser(response.data);
  } else {
    useStore.getState().setUser(undefined);
  }

  return response;
};

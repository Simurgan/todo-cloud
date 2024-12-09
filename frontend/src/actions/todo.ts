import { TodoItemCreateModel, TodoItemModel } from "../models/todo";
import { api } from "./api";
import { requestAuthorizationInterceptor } from "./interceptors";

const todoApi = api.create({
  baseURL: api.defaults.baseURL + "todoitems/",
});

todoApi.interceptors.request.use(requestAuthorizationInterceptor);

export const getTodoList = async () => {
  const response = await todoApi({
    method: "get",
  });

  return response.data as TodoItemModel[];
};

export const createTodoItem = async (data: TodoItemCreateModel) => {
  const response = await todoApi({
    method: "post",
    data: data,
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};

export const deleteTodoItem = async (id: number) => {
  const response = await todoApi({
    method: "delete",
    url: `${id}/`,
  });

  return response;
};

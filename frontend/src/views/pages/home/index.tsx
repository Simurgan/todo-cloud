import "./style.scss";
import logoutSvg from "../../../assets/icons/logout.svg";
import { useNavigate } from "react-router-dom";
import { Urls } from "../../../models/router";
import { logout } from "../../../actions/auth";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useStore } from "../../../store/store";
import {
  FileUpload,
  Form,
  FormType,
  InputText,
  Permit,
  useForm,
  Validate,
} from "vanora-react";
import Button from "../../components/button";
import { useEffect, useState } from "react";
import { TodoItemModel } from "../../../models/todo";
import {
  createTodoItem,
  deleteTodoItem,
  getTodoList,
} from "../../../actions/todo";
import TodoItemCard from "./todo-item-card";

const HomePage = () => {
  const [todoItems, setTodoItems] = useState<TodoItemModel[]>();
  const navigate = useNavigate();
  const todoForm = useForm();
  const user = useStore((x) => x.user);

  const arrangeTodoList = async () => {
    setTodoItems(await getTodoList());
  };

  useEffect(() => {
    arrangeTodoList();
  }, []);

  const logoutHandler = async () => {
    try {
      const response = await logout();
      if (response?.status === 205) {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 400) {
        toast.error("Token is already expired");
      } else {
        toast.error("Something went wrong with the login!");
      }
    }
    navigate(Urls.Login);
  };

  const todoFormSubmitHandler = async (form: FormType) => {
    const payload = form.get("attachment")?.value
      ? {
          title: form.get("title")?.value as string,
          attachment: form.get("attachment")?.data,
        }
      : {
          title: form.get("title")?.value as string,
        };

    try {
      const response = await createTodoItem(payload);
      const newItem = response.data as TodoItemModel;
      setTodoItems((prev) => (prev ? [newItem, ...prev] : [newItem]));
      if (response.status === 201) {
        toast.success("Todo Item created successfully");
        form.clear();
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.status === 400) {
        toast.error("Coulnd't create Todo item. Try again.");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const deleteItemHandler = async (todoItem: TodoItemModel) => {
    try {
      const response = await deleteTodoItem(todoItem.id);

      if (response.status === 204) {
        toast.success("Successfully deleted: " + todoItem.title);
        setTodoItems((prev) => prev?.filter((x) => x.id !== todoItem.id));
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.status === 404) {
        toast.error("Item already deleted");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <section className="home-section">
      <div className="container">
        <div className="content">
          <div className="title-container">
            <div className="title-text">
              <h1>ToDo</h1>
              <p>List, add, edit, delete ToDo items</p>
            </div>
            <div className="account-container">
              <p>{user?.email}</p>
              <div className="logout-icon-container" onClick={logoutHandler}>
                <img src={logoutSvg} className="logout-icon" />
              </div>
            </div>
          </div>
          <div className="todo-form-container">
            <Form
              form={todoForm}
              classNames="form todo-form"
              onSubmit={todoFormSubmitHandler}
            >
              <div className="form-fields">
                <InputText
                  name="title"
                  placeholder="Todo item..."
                  permissions={[Permit.MaxLength(80)]}
                  validations={[Validate.Required("Title is required")]}
                />
                <FileUpload
                  classNames="file-input"
                  name="attachment"
                  multiple={false}
                />
              </div>
              <Button type="submit" classNames="submit-todo-button">
                Add item
              </Button>
            </Form>
          </div>
          <div className="todo-list-container">
            {todoItems?.map((todoItem) => (
              <TodoItemCard
                key={todoItem.id}
                todoItem={todoItem}
                deleteHandler={deleteItemHandler}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomePage;

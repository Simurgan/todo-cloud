import { TodoItemModel } from "../../../../models/todo";
import Button from "../../../components/button";
import "./style.scss";

interface TodoItemProps {
  todoItem: TodoItemModel;
  deleteHandler: (todoItem: TodoItemModel) => Promise<void>;
}

const TodoItemCard = ({ todoItem, deleteHandler }: TodoItemProps) => {
  return (
    <div className="todo-item-container">
      {todoItem.attachment && (
        <div className="todo-image-container">
          <img src={todoItem.attachment} className="todo-image" />
        </div>
      )}
      <div className="bottom-container">
        <div className="todo-text-container">
          <h3>{todoItem.title}</h3>
          <p>{new Date(todoItem.created_at).toLocaleString()}</p>
        </div>
        <Button
          type="button"
          classNames="delete-button"
          onClick={() => deleteHandler(todoItem)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
export default TodoItemCard;

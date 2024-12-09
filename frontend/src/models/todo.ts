export type TodoItemModel = {
  id: number;
  created_at: string;
  title: string;
  attachment?: string;
  owner: number;
};

export type TodoItemCreateModel = {
  title: string;
  attachment?: File;
};

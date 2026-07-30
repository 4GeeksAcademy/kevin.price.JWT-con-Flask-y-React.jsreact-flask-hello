export const initialStore = () => {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");

  return {
    message: null,
    token: token || null,
    user: user ? JSON.parse(user) : null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':

      const { id, color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case 'login':
     
      sessionStorage.setItem("token", action.payload.token);
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user
      };

    case 'logout':
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      return {
        ...store,
        token: null,
        user: null
      };

    default:
      throw Error('Unknown action.');
  }
}
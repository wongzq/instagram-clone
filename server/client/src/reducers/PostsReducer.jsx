// state is array of posts
export const initState = [];

// reducer to update posts
export const reducer = (state, action) => {
  switch (action.type) {
    case "POPULATE":
      return action.payload;
    case "DELETE":
      return state.filter((post) => post._id !== action.payload._id);
    case "UPDATE":
      return state.map((post) =>
        post._id === action.payload._id ? action.payload._id : post
      );
    case "CLEAR":
      return initState;
    default:
      return state;
  }
};

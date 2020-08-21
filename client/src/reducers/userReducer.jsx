const initState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return null;
  }
};

export default { reducer, initState };

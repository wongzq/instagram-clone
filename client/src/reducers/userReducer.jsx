const initState = null;

const reducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "LOGOUT":
      return null;
    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    default:
      return null;
  }
};

export default { reducer, initState };

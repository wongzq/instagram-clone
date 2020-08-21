import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import UserReducer from "./reducers/UserReducer";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./screens/Home";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";
import CreatePost from "./screens/CreatePost";

const UserContext = React.createContext();

const AppRouting = () => {
  const history = useHistory();
  const { dispatch } = React.useContext(UserContext);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      {/* Home */}
      <Route exact path="/">
        <Home></Home>
      </Route>

      {/* Sign Up */}
      <Route path="/signup">
        <SignUp></SignUp>
      </Route>

      {/* Sign In */}
      <Route path="/signin">
        <SignIn></SignIn>
      </Route>

      {/* Profile */}
      <Route path="/profile">
        <Profile></Profile>
      </Route>

      {/* Create Post */}
      <Route path="/createpost">
        <CreatePost></CreatePost>
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = React.useReducer(
    UserReducer.reducer,
    UserReducer.initState
  );

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar></NavBar>
        <AppRouting></AppRouting>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
export { UserContext };

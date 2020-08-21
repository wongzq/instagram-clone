import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { reducer, initialState } from "./reducers/userReducer";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./screens/Home";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";
import CreatePost from "./screens/CreatePost";

export const UserContext = React.createContext({});

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = React.useContext(UserContext);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
      history.push("/");
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
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar></NavBar>
        <Routing></Routing>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

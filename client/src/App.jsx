import React from "react";
import "./App.css";

import { BrowserRouter, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./screens/Home";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";
import CreatePost from "./screens/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <NavBar></NavBar>
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
      <Route path="/createPost">
        <CreatePost></CreatePost>
      </Route>
    </BrowserRouter>
  );
}

export default App;

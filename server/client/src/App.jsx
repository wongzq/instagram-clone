import React from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import UserReducer from "./reducers/UserReducer";

import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./screens/Home";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Profile from "./screens/Profile";
import UserProfile from "./screens/UserProfile";
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
    }, [history, dispatch]);

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

            {/* My Profile */}
            <Route exact path="/profile">
                <Profile></Profile>
            </Route>

            {/* User Profile */}
            <Route path="/profile/:userId">
                <UserProfile></UserProfile>
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

import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const NavBar = () => {
  const { state, dispatch } = React.useContext(UserContext);

  const renderList = () => {
    if (state) {
      return [
        <li key="profile">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="createpost">
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li key="logout">
          <Link
            to="/signin"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "LOGOUT" });
              M.toast({
                html: "Logged out successfully",
                classes: "#42a5f5 blue darken-1",
              });
            }}
          >
            Logout
          </Link>
        </li>,
      ];
    } else {
      return [
        <li key="signin">
          <Link to="/signin">Sign in</Link>
        </li>,
        <li key="signup">
          <Link to="/signup">Sign up</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link
          to={state ? "/" : "/signin"}
          className="brand-logo left grand-hotel-font"
        >
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

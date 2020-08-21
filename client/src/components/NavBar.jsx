import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to="/" className="brand-logo left grand-hotel-font">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          <li>
            <Link to="/signin">Sign in</Link>
          </li>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/createpost">Create Post</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

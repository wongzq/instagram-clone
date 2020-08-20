import React from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2 className="grand-hotel-font">Instagram</h2>
        <input type="text" placeholder="Email"></input>
        <input type="text" placeholder="Password"></input>
        <br />
        <br />
        <button className="btn waves-effect waves-light #42a5f5 blue lighten-1">
          Login
        </button>
        <p>
          <Link to="/signup">Don't have an account? Sign up now</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

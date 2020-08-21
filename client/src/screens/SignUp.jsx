import React from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const PostData = () => {
    // if invalid email format
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "#ef5350 red lighten-1" });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message) {
          M.toast({ html: data.message, classes: "#42a5f5 blue darken-1" });
          history.push("/signin");
        }

        if (data.error) {
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2 className="grand-hotel-font">Instagram</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <br />
        <br />
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() => PostData()}
        >
          Sign up
        </button>
        <p>
          <Link to="/signin">Already have an account? Sign in instead</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

import React from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";

const SignIn = () => {
  const { dispatch } = React.useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const PostData = () => {
    // if invalid email format
    if (
      !/^(([^<>()\\\\.,;:\s@"]+(\.[^<>()\\\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid email", classes: "#ef5350 red lighten-1" });
      return;
    }

    fetch("/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#ef5350 red lighten-1" });
          return;
        }

        // save to local storage
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        dispatch({ type: "USER", payload: data.user });

        M.toast({
          html: "Signed in successfully",
          classes: "#42a5f5 blue darken-1",
        });
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2 className="grand-hotel-font">Instagram</h2>
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
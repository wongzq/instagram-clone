import React from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [image, setImage] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState("");

  React.useEffect(() => {
    if (imgUrl) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ title, body, imgUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({
              html: data.error,
              classes: "#ef5350 red lighten-1",
            });
            return;
          }

          M.toast({
            html: "Created post successfully",
            classes: "#42a5f5 blue darken-1",
          });
          history.push("/profile");
        })
        .catch((err) => console.log(err));
    }
  }, [imgUrl]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "zq-instagram");
    data.append("cloud_name", "zq-instagram");

    fetch("https://api.cloudinary.com/v1_1/zq-instagram/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setImgUrl(data.url))
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></input>
      <div className="file-field input-field">
        <div className="btn #42a5f5 blue darken-1">
          <span>Upload image</span>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          ></input>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text"></input>
        </div>
      </div>

      <button
        className="btn waves-effect waves-light #42a5f5 blue darken-1"
        onClick={() => postDetails()}
      >
        Create
      </button>
    </div>
  );
};

export default CreatePost;

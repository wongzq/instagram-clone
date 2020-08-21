import React from "react";

const CreatePost = () => {
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
      <input type="text" placeholder="title"></input>
      <input type="text" placeholder="body"></input>
      <div className="file-field input-field">
        <div className="btn #42a5f5 blue darken-1">
          <span>Upload image</span>
          <input type="file"></input>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text"></input>
        </div>
      </div>

      <button className="btn waves-effect waves-light #42a5f5 blue darken-1">
        Create
      </button>
    </div>
  );
};

export default CreatePost;

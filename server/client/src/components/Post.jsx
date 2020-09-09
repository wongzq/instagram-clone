import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { PostsContext } from "../screens/Home";
import "./Post.css";

function Post(props) {
  // auth constant
  const authHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  // React Hooks
  const { state } = React.useContext(UserContext);
  const { postsDispatch } = React.useContext(PostsContext);
  const [post, setPost] = React.useState(props.post);
  const [showComment, setShowComment] = React.useState(false);

  // methods
  const toggleLikePost = (id, liked) => {
    fetch(liked ? "/unlike" : "/like", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      })
      .catch((err) => console.log(err));
  };

  const comment = (text, postId) => {
    if (!text) return;

    return fetch("/comment", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ text, postId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      })
      .catch((err) => console.log(err));
  };

  const uncomment = (postId, commentId) => {
    if (!postId || !commentId) return;

    fetch("/uncomment", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ postId, commentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        postsDispatch({ type: "DELETE", payload: data });
      });
  };

  return (
    <div className="card home-card post-container" key={post._id}>
      <h5>
        <Link
          className="cursor-pointer"
          to={
            post.postedBy._id === state._id
              ? `/profile`
              : `/profile/${post.postedBy._id}`
          }
        >
          {post.postedBy.name}
        </Link>
        {post.postedBy._id === state._id && (
          <i
            className="material-icons"
            style={{ float: "right", color: "#000" }}
            onClick={() => deletePost(post._id)}
          >
            delete
          </i>
        )}
      </h5>
      <div className="card-image">
        <img alt="" src={post.imgUrl}></img>
      </div>
      <div className="card-content">
        <i
          className="material-icons"
          style={{
            color: post.likes.includes(state._id) ? "#f00" : "#000",
          }}
          onClick={() =>
            toggleLikePost(post._id, post.likes.includes(state._id))
          }
        >
          {post.likes.includes(state._id) ? "favorite" : "favorite_border"}
        </i>
        <i
          className="material-icons"
          style={{ margin: "0px 10px", color: "#000" }}
          onClick={() => setShowComment((prev) => !prev)}
        >
          chat_bubble_outline
        </i>
        <h6>{post.likes.length} likes</h6>
        <h6>
          <span style={{ fontWeight: "500" }}>{post.postedBy.name}</span>{" "}
          {post.body}
        </h6>
        {post.comments.map((comment) => (
          <h6 key={comment._id}>
            <span style={{ fontWeight: "500" }}>{comment.postedBy.name}</span>{" "}
            {comment.text}
            {comment.postedBy._id === state._id && (
              <i
                className="material-icons"
                style={{ float: "right", color: "#000" }}
                onClick={() => uncomment(post._id, comment._id)}
              >
                close
              </i>
            )}
          </h6>
        ))}
        {showComment ? (
          <form
            className="input-field post-comment-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.persist();
              comment(e.target[0].value, post._id).then(
                (_) => (e.target[0].value = "")
              );
            }}
          >
            <input type="text" placeholder="Add a comment" />
            <button>
              <i
                className="material-icons"
                style={{ marginLeft: "2rem", color: "#000" }}
              >
                send
              </i>
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default Post;

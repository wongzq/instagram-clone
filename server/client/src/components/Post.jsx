import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { PostsContext } from "../screens/Home";
import "./Post.css";
import M from "materialize-css";

const Post = (props) => {
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
  React.useEffect(() => {
    M.AutoInit();
  }, []);

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

  const comment = async (text) => {
    if (!text) return;

    try {
      const res = await fetch("/comment", {
        method: "put",
        headers: authHeaders,
        body: JSON.stringify({ text, postId: post._id }),
      });
      const data = await res.json();
      setPost(data);
    } catch (err) {
      return console.log(err);
    }
  };

  const uncomment = (commentId) => {
    if (!commentId) return;

    fetch("/uncomment", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ postId: post._id, commentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      });
  };

  const deletePost = () => {
    fetch(`/deletePost/${post._id}`, {
      method: "delete",
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => postsDispatch({ type: "DELETE", payload: data }));
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

        <div style={{ float: "right" }}>
          <div
            className="dropdown-trigger"
            data-target={
              state._id === post.postedBy._id
                ? `dropdown1${post._id}`
                : `dropdown2${post._id}`
            }
          >
            <i
              className="material-icons"
              style={{ float: "right", color: "#000" }}
            >
              more_vert
            </i>
          </div>
          <ul
            id={`dropdown1${post._id}`}
            className="dropdown-content dropdown1"
          >
            <li>
              <div id="delete" onClick={() => deletePost()}>
                <span>Delete post</span>
              </div>
            </li>
          </ul>
          <ul
            id={`dropdown2${post._id}`}
            className="dropdown-content dropdown2"
          >
            <li>
              <div id="follow" onClick={() => {}}>
                <span>Follow</span>
              </div>
            </li>
          </ul>
        </div>
      </h5>
      <div className="img-container">
        <img className="img-content" alt="" src={post.imgUrl}></img>
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
                className="material-icons btn-send"
              >
                send
              </i>
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default Post;

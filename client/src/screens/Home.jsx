import React from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const Home = () => {
  const authHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  const [posts, setPosts] = React.useState([]);
  const { state } = React.useContext(UserContext);

  React.useEffect(() => {
    fetch("/getPosts", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      });
  }, []);

  const toggleLikePost = (id, liked) => {
    fetch(liked ? "/unlike" : "/like", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newPosts = posts.map((post) =>
          post._id === data._id ? data : post
        );
        setPosts(newPosts);
      })
      .catch((err) => console.log(err));
  };

  const comment = (text, postId) => {
    if (!text) return;

    fetch("/comment", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ text, postId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newPosts = posts.map((post) =>
          post._id === data._id ? data : post
        );
        setPosts(newPosts);
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
        const newPosts = posts.map((post) =>
          post._id === data._id ? data : post
        );
        setPosts(newPosts);
      });
  };

  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        const newPosts = posts.filter((post) => post._id !== data._id);
        setPosts(newPosts);
      });
  };

  return (
    <div className="home">
      {posts.map((post) => (
        <div className="card home-card" key={post._id}>
          <h5>
            <Link className="cursor-pointer"
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
            >
              chat_bubble_outline
            </i>
            <h6>{post.likes.length} likes</h6>

            <h6>{post.title}</h6>
            <p>{post.body}</p>
            {post.comments.map((comment) => (
              <h6 key={comment._id}>
                <span style={{ fontWeight: "500" }}>
                  {comment.postedBy.name}
                </span>{" "}
                {comment.text}
                {comment.postedBy._id === state._id && (
                  <i
                    className="material-icons"
                    style={{ float: "right", color: "#000" }}
                    onClick={() => uncomment(post._id, comment._id)}
                  >
                    delete
                  </i>
                )}
              </h6>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                comment(e.target[0].value, post._id);
              }}
            >
              <input type="text" placeholder="Add a comment"></input>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

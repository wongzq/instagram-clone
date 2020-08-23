import React from "react";
import { UserContext } from "../App";

const Home = () => {
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
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
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

  const newComment = (text, postId) => {
    if (!text) return;
    
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ text, postId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const newPosts = posts.map((post) =>
          post._id === data._id ? data : post
        );
        setPosts(newPosts);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {posts.map((post) => (
        <div className="card home-card" key={post._id}>
          <h5>{post.postedBy.name}</h5>
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
              </h6>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                newComment(e.target[0].value, post._id);
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

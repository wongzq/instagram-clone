import React from "react";
import { UserContext } from "../App";
import Post from "../components/Post";
import "./Profile.css";

const Profile = () => {
  const [posts, setPosts] = React.useState([]);
  const { state } = React.useContext(UserContext);
  const [viewPost, setViewPost] = React.useState({});

  React.useEffect(() => {
    fetch("/myPosts", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts.reverse()));
  }, []);

  return state ? (
    <div style={{ maxWidth: "800px", margin: "0px auto" }}>
      {Object.keys(viewPost).length === 0 ? null : (
        <div className="view-post-container">
          <div className="view-post-overlay"></div>
          <div className="view-post">
            <div
              className="btn-close-container"
              onClick={() => setViewPost({})}
            >
              <i className="material-icons">close</i>
            </div>
            <Post post={viewPost} usesPostsContext={false} />
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          margin: "calc(10%/6)",
          borderBottom: "1px solid #9e9e9e",
        }}
      >
        <div style={{ padding: "25px" }}>
          <img
            alt=""
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
            }}
            src="https://haircutinspiration.com/wp-content/uploads/Teen-Boy-Haircuts-1-1-.jpg"
          ></img>
        </div>
        <div style={{ width: "60%", padding: "25px" }}>
          <h4>{state.name}</h4>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6>
              <b>{posts.length}</b> posts
            </h6>
            <h6>
              <b>{state.followers.length}</b> followers
            </h6>
            <h6>
              <b>{state.following.length}</b> following
            </h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {posts.map((post) => (
          <div className="gallery-item-container" key={post._id}>
            <img
              alt=""
              className="gallery-item"
              src={post.imgUrl}
              onClick={() => setViewPost(post)}
            ></img>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <h2 className="grand-hotel-font" style={{ textAlign: "center" }}>
      loading . . .
    </h2>
  );
};

export default Profile;

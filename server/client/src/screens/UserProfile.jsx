import React from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import "./Profile.css";
import "./UserProfile.css";

const Profile = () => {
  const [userProfile, setUserProfile] = React.useState(null);
  const [followed, setFollowed] = React.useState(null);
  const { dispatch } = React.useContext(UserContext);
  const { userId } = useParams();

  const authHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
  };

  React.useEffect(() => {
    fetch(`/users/${userId}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserProfile({ ...data, posts: data.posts.reverse() });
        const me = JSON.parse(localStorage.getItem("user"));
        setFollowed(me.following.includes(userId));
      });
  }, [userId]);

  const toggleFollowUser = () => {
    if (followed === null) return;

    fetch(followed ? "/unfollow" : "/follow", {
      method: "put",
      headers: authHeaders,
      body: JSON.stringify({ followeeId: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserProfile((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: followed
              ? prevState.user.followers.filter(
                  (follower) => follower !== data._id
                )
              : [...prevState.user.followers, data._id],
          },
        }));

        const me = JSON.parse(localStorage.getItem("user"));
        setFollowed(me.following.includes(userId));
      });
  };

  return userProfile ? (
    <div style={{ maxWidth: "800px", margin: "0px auto" }}>
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
          <h4 style={{ display: "flex", justifyContent: "space-between" }}>
            {userProfile.user.name}{" "}
            <button
              className={
                followed
                  ? "btn waves-effect waves-light grey lighten-1 btn-follow"
                  : "btn waves-effect waves-light blue darken-1 btn-follow"
              }
              onClick={() => toggleFollowUser()}
            >
              {followed === null ? "loading" : followed ? "followed" : "follow"}
            </button>
          </h4>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h6>
              <b>{userProfile.posts.length}</b> posts
            </h6>
            <h6>
              <b>{userProfile.user.followers.length}</b> followers
            </h6>
            <h6>
              <b>{userProfile.user.following.length}</b> following
            </h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {userProfile.posts &&
          userProfile.posts.map((post) => (
            <div className="gallery-item-container" key={post._id}>
              <img alt="" className="gallery-item" src={post.imgUrl}></img>
            </div>
          ))}
      </div>
    </div>
  ) : (
    <div>
      <h2 className="grand-hotel-font" style={{ textAlign: "center" }}>
        loading . . .
      </h2>
    </div>
  );
};

export default Profile;

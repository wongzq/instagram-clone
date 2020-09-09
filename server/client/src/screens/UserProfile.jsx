import React from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";

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
            src="data:image/jpeg;base64,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"
          ></img>
        </div>
        <div style={{ width: "60%", padding: "25px" }}>
          <h4 style={{ display: "flex", justifyContent: "space-between" }}>
            {userProfile.user.name}{" "}
            <button
              className={
                followed
                  ? "btn waves-effect waves-light grey lighten-1"
                  : "btn waves-effect waves-light blue darken-1"
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
            <div className="gallery-item-container">
              <img
                key={post._id}
                alt=""
                className="gallery-item"
                src={post.imgUrl}
              ></img>
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

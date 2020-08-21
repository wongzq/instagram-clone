import React from "react";

const Home = () => {
  const [posts, setPosts] = React.useState([]);
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

  return (
    <div className="home">
      {posts.map((post) => (
        <div className="card home-card" key={post._id}>
          <h5>{post.postedBy.name}</h5>
          <div className="card-image">
            <img alt="" src={post.imgUrl}></img>
          </div>
          <div className="card-content">
            <h6>{post.title}</h6>
            <i className="material-icons" style={{ color: "#f00" }}>
              favorite
            </i>
            <p>{post.body}</p>
            <input type="text" placeholder="Add a comment"></input>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;

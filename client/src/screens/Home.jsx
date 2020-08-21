import React from "react";

const Home = () => {
  return (
    <div className="home">
      <div className="card home-card">
        <h5>alexis</h5>
        <div className="card-image">
          <img src="https://images.unsplash.com/photo-1498550744921-75f79806b8a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"></img>
        </div>
        <div className="card-content">
          <h6>title</h6>
          <i class="material-icons" style={{ color: "#f00" }}>
            favorite
          </i>
          <p>This is a beautiful wallpaper</p>
          <input type="text"></input>
        </div>
      </div>
    </div>
  );
};

export default Home;

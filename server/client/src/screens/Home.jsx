import React from "react";
import Post from "../components/Post";
import { reducer, initState } from "../reducers/PostsReducer";

// PostsContext
export const PostsContext = React.createContext();

// Home Component
const Home = () => {
  // React Hooks
  const [postsState, postsDispatch] = React.useReducer(reducer, initState);
  React.useEffect(() => {
    fetch("/getPosts", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        postsDispatch({ type: "POPULATE", payload: data.posts.reverse() })
      );
  }, []);

  // Return Home Component
  return (
    <PostsContext.Provider value={{ postsState, postsDispatch }}>
      <div className="home">
        {postsState.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </PostsContext.Provider>
  );
};

export default Home;

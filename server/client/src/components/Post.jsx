import React from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import { PostsContext } from "../screens/Home";
import "./Post.css";
import M from "materialize-css";

const PostWithoutPostsContext = (props) => {
    // auth constant
    const authHeaders = {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("jwt")}`,
    };

    // React Hooks
    const history = useHistory();
    const { state, dispatch } = React.useContext(UserContext);
    const [post, setPost] = React.useState(props.post);
    const [showComment, setShowComment] = React.useState(false);
    const [followed, setFollowed] = React.useState(false);
    React.useEffect(() => {
        // initialize Materialize CSS
        M.AutoInit();
    }, []);
    React.useEffect(() => {
        // get followed
        const me = JSON.parse(localStorage.getItem("user"));
        setFollowed(me.following.includes(post.postedBy._id));
    }, [post.postedBy._id]);

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
            .then((data) =>
                props.postsDispatch
                    ? props.postsDispatch({ type: "DELETE", payload: data })
                    : null
            );
    };

    const toggleFollowUser = () => {
        fetch(followed ? "/unfollow" : "/follow", {
            method: "put",
            headers: authHeaders,
            body: JSON.stringify({ followeeId: post.postedBy._id }),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        followers: data.followers,
                        following: data.following,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data));
                setFollowed((prev) => !prev);
            });
    };

    const viewProfile = () => {
        history.push(`/profile/${post.postedBy._id}`);
    };

    return (
        <div className="card home-card post-container" key={post._id}>
            {/* Header */}
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
                    {/* dropdown 1 */}
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
                    {/* dropdown 2 */}
                    <ul
                        id={`dropdown2${post._id}`}
                        className="dropdown-content dropdown2"
                    >
                        <li>
                            <div id="follow" onClick={() => toggleFollowUser()}>
                                <span>{followed ? "Unfollow" : "Follow"}</span>
                            </div>
                        </li>
                        <li onClick={() => viewProfile()}>
                            <div id="view">
                                <span>View profile</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </h5>

            {/* Image */}
            <div className="img-container">
                <img className="img-content" alt="" src={post.imgUrl}></img>
            </div>

            {/* Actions */}
            <div className="card-content">
                {/* Heart / Like / Favourite Icon */}
                <i
                    className="material-icons"
                    style={{
                        color: post.likes.includes(state._id) ? "#f00" : "#000",
                    }}
                    onClick={() =>
                        toggleLikePost(post._id, post.likes.includes(state._id))
                    }
                >
                    {post.likes.includes(state._id)
                        ? "favorite"
                        : "favorite_border"}
                </i>

                {/* Comment Icon */}
                <i
                    className="material-icons"
                    style={{ margin: "0px 10px", color: "#000" }}
                    onClick={() => setShowComment((prev) => !prev)}
                >
                    chat_bubble_outline
                </i>

                {/* Text */}
                <h6>{post.likes.length} likes</h6>
                <h6>
                    <span style={{ fontWeight: "500" }}>
                        {post.postedBy.name}
                    </span>{" "}
                    {post.body}
                </h6>

                {/* Comments */}
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
                                onClick={() => uncomment(comment._id)}
                            >
                                close
                            </i>
                        )}
                    </h6>
                ))}

                {/* New comment */}
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
                            <i className="material-icons btn-send">send</i>
                        </button>
                    </form>
                ) : null}
            </div>
        </div>
    );
};

const PostWithPostsContext = (props) => {
    const { postsDispatch } = React.useContext(PostsContext);

    return (
        <PostWithoutPostsContext
            post={props.post}
            postsDispatch={postsDispatch}
        />
    );
};

const Post = (props) => {
    return Object.keys(props.post).length === 0 ? (
        // if no post
        <div></div>
    ) : props.usesPostsContext === undefined ||
      props.usesPostsContext === null ||
      !props.usesPostsContext ? (
        // if isolated post
        <PostWithoutPostsContext post={props.post} />
    ) : (
        // if post with home posts
        <PostWithPostsContext post={props.post} />
    );
};

export default Post;

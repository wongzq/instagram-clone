import React from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
    const history = useHistory();
    const [body, setBody] = React.useState("");
    const [image, setImage] = React.useState("");
    const [imgUrl, setImgUrl] = React.useState("");
    const [imgPreview, setImgPreview] = React.useState("");

    React.useEffect(() => {
        if (imgUrl) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("jwt"),
                },
                body: JSON.stringify({ body, imgUrl }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        M.toast({
                            html: data.error,
                            classes: "#ef5350 red lighten-1",
                        });
                        return;
                    }

                    M.toast({
                        html: "Created post successfully",
                        classes: "#42a5f5 blue darken-1",
                    });

                    history.push("/profile");
                })
                .catch((err) => console.log(err));
        }
    }, [imgUrl, body, history]); // react-hooks/exhaustive-deps

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "zq-instagram");
        data.append("cloud_name", "zq-instagram");

        fetch("https://api.cloudinary.com/v1_1/zq-instagram/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => setImgUrl(data.url))
            .catch((err) => console.log(err));
    };

    return (
        <div
            className="card input-field"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center",
            }}
        >
            {imgPreview ? (
                <div className="img-preview-container">
                    <img className="img-preview" src={imgPreview} alt="" />
                </div>
            ) : null}
            <div className="create-post-btn-container">
                <div className="file-field">
                    <div className="file-btn-container">
                        <div className="btn create-post-btn">
                            <span>Choose image</span>
                            <input
                                type="file"
                                accept="image/x-png,image/jpeg"
                                onChange={(e) => {
                                    if (e.target.files.length > 0) {
                                        setImgPreview(
                                            URL.createObjectURL(
                                                e.target.files[0]
                                            )
                                        );
                                        setImage(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="btn create-post-btn"
                    onClick={() => postDetails()}
                >
                    Share
                </button>
            </div>

            <input
                type="text"
                className="create-post-caption"
                placeholder="Write a caption . . ."
                value={body}
                onChange={(e) => {
                    if (e.target) {
                        setBody(e.target.value);
                    }
                }}
            ></input>
        </div>
    );
};

export default CreatePost;

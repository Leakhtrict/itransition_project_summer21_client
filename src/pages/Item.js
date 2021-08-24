import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import io from "socket.io-client";

let socket;

function Item() {
    const { authState } = useContext(AuthContext);
    let { itemId } = useParams();
    let history = useHistory();
    const [itemBody, setItemBody] = useState({ Likes: [] });
    const [newComment, setNewComment] = useState("");
    const [thisComments, setThisComments] = useState([]);

    useEffect(() => {
        socket = io("http://localhost:3001");

        socket.on("emitSendComment", (data) => {
            setThisComments(prevState => [...prevState, data]);
        });

        axios.get(`http://localhost:3001/items/byId/${itemId}`).then((response) => {
            setItemBody(response.data);
        });

        axios.get(`http://localhost:3001/comments/${itemId}`).then((response) => {
            setThisComments(response.data);
        });
    }, [itemId]);

    const addComment = () => {
        if (newComment){
            axios.post("http://localhost:3001/comments", {
                username: authState.username,
                commentBody: newComment,
                ItemId: itemId,
                UserId: authState.id,
            },
            { headers: {accessToken: localStorage.getItem("accessToken") } }
            ).then( async (response) => {
                if (response.data.error) {
                    history.push("/");
                } else {
                    console.log(socket);
                    await socket.emit("sendComment", response.data);
                    setThisComments([...thisComments, response.data]);
                    setNewComment("");
                }
            });
        }
    };

    const deleteComment = (id) => {
        console.log(id);
        axios.delete(`http://localhost:3001/comments/${id}`,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
            setThisComments(
                thisComments.filter((val) => {
                  return val.id !== id;
                })
            );
        });
    };

    const likeItem = (itemId) => {
        axios.post("http://localhost:3001/likes", 
        { ItemId: itemId }, 
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((response) => {
            if (!response.data.error){
                setItemBody(() => {
                    if (response.data.liked){
                        return {...itemBody, Likes: [...itemBody.Likes, 0]};
                    } else if (!response.data.liked){
                        const allLikes = itemBody.Likes;
                        allLikes.pop();
                        return {...itemBody, Likes: allLikes};
                    }
                });
            }
        });
    };

    return (
        <div>
            <div>
                <div>{itemBody.name}</div>
                <div>{itemBody.tags}</div>
                <button className="likeButton" onClick={() => {likeItem(itemId)}}>
                    <FavoriteBorderIcon />
                    {itemBody.Likes.length}
                </button>
            </div>
            <div>
                {thisComments.map((value, key) => {
                    return(
                        <div key={key}>
                            {authState.username === value.username && <button onClick={() => deleteComment(value.id)}> X</button>}
                            <div className="comment">
                                <div>{value.username}</div>
                                <div>{value.commentBody}</div>
                                <div>{new Date(value.createdAt).toLocaleString()}</div>
                            </div>
                        </div>
                    )
                })}
                <div>
                    {authState.status && 
                        <>
                            <input type="text" value={newComment} onChange={(event) => {setNewComment(event.target.value)}} />
                            <button onClick={addComment}>
                                <FormattedMessage id="item-page.add-comment" />
                            </button>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}


export default Item;
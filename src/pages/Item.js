import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import { IconButton, Grid, Container, Paper, OutlinedInput, InputAdornment } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import io from "socket.io-client";
import AdditionalFields from "../components/AdditionalFields";

let socket;

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
    },
    updatedAt: {
        fontSize: 12,
        color: "grey",
    },
    textField: {
        backgroundColor: "rgba(255,255,255,0.5)",
        margin: "8px",
        border: "solid 1px red",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        width: "100%",
    },
    otherFields: {
        margin: "0px 4px 8px",
    },
    commentItem: {
        borderBottom: "solid 1px black",
        paddingTop: 8,
        marginBottom: 8,
    },
    commentSection: {
        backgroundColor: "rgba(255,255,255,0.3)",
        border: "1px solid lightgray",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        padding: 8,
    },
    commentInput: {
        width: "100%",
    },
    noComments: {
        fontSize: 12,
        color: "rgb(110, 110, 110)",
        width: "100%",
        marginBottom: 8,
        textAlign: "center",
    },
}));

function Item() {
    const classes = useStyles();
    const { authState } = useContext(AuthContext);
    let { itemId } = useParams();
    let history = useHistory();
    const [itemBody, setItemBody] = useState({ Likes: [] });
    const [thisTags, setThisTags] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [thisComments, setThisComments] = useState([]);
    const [fromCollection, setFromCollection] = useState({});
    const [isLiked, setIsliked] = useState(false);

    useEffect(() => {
        socket = io("https://itransition-project-genis.herokuapp.com");

        socket.on("emitSendComment", (data) => {
            if(data.ItemId === itemId){
                setThisComments(prevState => [...prevState, data]);
            }
        });
    }, []);

    useEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/items/byId/${itemId}`)
        .then((response) => {
            setItemBody(response.data);
            setThisTags(response.data.tags.split(" ").slice(0, -1));
            const likesList = response.data.Likes;
            likesList.map((value) => {
                if(value.UserId === authState.id){
                    setIsliked(true);
                }
                return value;
            })
            axios.get(`https://itransition-project-genis.herokuapp.com/collections/byIdNoAuth/${response.data.CollectionId}`)
            .then((response2) => {
                setFromCollection(response2.data);
            });
        });

        axios.get(`https://itransition-project-genis.herokuapp.com/comments/${itemId}`)
        .then((response) => {
            setThisComments(response.data);
        });
    }, [authState, itemId]);

    const addComment = () => {
        if (newComment){
            axios.post("https://itransition-project-genis.herokuapp.com/comments", {
                username: authState.username,
                commentBody: newComment,
                ItemId: itemId,
                UserId: authState.id,
            },
            { headers: {accessToken: localStorage.getItem("accessToken") } })
            .then( async (response) => {
                if (response.data.error) {
                    localStorage.removeItem("accessToken");
                    history.push("/");
                } else {
                    await socket.emit("sendComment", response.data);
                    setThisComments([...thisComments, response.data]);
                    setNewComment("");
                }
            });
        }
    };

    const deleteComment = (id) => {
        axios.delete(`https://itransition-project-genis.herokuapp.com/comments/${id}`,
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
            if (response.data.error){
                localStorage.removeItem("accessToken");
                history.push("/");
            } else{
                setThisComments(
                    thisComments.filter((val) => {
                      return val.id !== id;
                    })
                );
            }
        });
    };

    const likeItem = (itemId) => {
        axios.post("https://itransition-project-genis.herokuapp.com/likes", 
        { ItemId: itemId }, 
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
            if (!response.data.error){
                setItemBody(() => {
                    if (response.data.liked){
                        const allLikes = itemBody.Likes;
                        allLikes.push("0");
                        return {...itemBody, Likes: allLikes};
                    } else if (!response.data.liked){
                        const allLikes = itemBody.Likes;
                        allLikes.pop();
                        return {...itemBody, Likes: allLikes};
                    }
                });
                setIsliked(!isLiked);
            } else{
                localStorage.removeItem("accessToken");
                history.push("/");
            }
        });
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            addComment();
        }
    };

    return (
        <div style={{ wordBreak: "break-word", maxWidth: "calc(min(95vw, 600px))" }}>
            <Container maxWidth="xs">
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid item className={classes.title}>{itemBody.name}</Grid>
                    <Grid item className={classes.updatedAt}>
                        <FormattedMessage id="item-page.updatedAt" />
                        {" " + new Date(itemBody.updatedAt).toLocaleString()}
                    </Grid>
                </Grid>
            </Container>
            <Grid container style={{ margin: "10px" }} justifyContent="flex-start" alignItems="flex-start">
                {thisTags.map((value, key) => {
                    return(
                        <Grid item key={key} onClick={() => {history.push(`/byTag/${value}`)}} className="itemTag" style={{ margin: "6px" }}>
                            {"#" + value}
                        </Grid>
                    )
                })}
            </Grid>
            <AdditionalFields fromCollection={fromCollection} itemBody={itemBody} classes={classes}/>
            <IconButton onClick={() => {likeItem(itemId)}} style={{ color: "red" }}>
                {isLiked ?
                    <FavoriteIcon /> :
                    <FavoriteBorderIcon />
                }
                {itemBody.Likes.length}
            </IconButton>
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" className={classes.commentSection}>
                {thisComments.length ? 
                    thisComments.map((value, key) => {
                        return(
                            <Grid 
                                item
                                key={key}
                                container
                                direction="column"
                                justifyContent="flex-start"
                                alignItems="flex-start"
                                spacing={1}
                                className={classes.commentItem}
                            >
                                {(authState.username === value.username || authState.isAdmin) && 
                                    <IconButton onClick={() => deleteComment(value.id)} style={{ color: "black", height: "10px", width: "10px" }}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                <Grid item>
                                    <strong>{value.username}</strong>
                                    <div style={{ margin: "6px" }}>{value.commentBody}</div>
                                    <div style={{ fontSize: 12 }}>{new Date(value.createdAt).toLocaleString()}</div>
                                </Grid>
                            </Grid>
                        )
                    }) : 
                    <div className={classes.noComments}><FormattedMessage id="item-page.noComments" /></div>
                }
                <Grid item className={classes.commentInput}>
                    {authState.status && 
                        <div>
                            <Paper>
                                <OutlinedInput
                                    type="text"
                                    value={newComment}
                                    onChange={(event) => {setNewComment(event.target.value)}}
                                    onKeyDown={handleKeyDown}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={addComment} style={{ color: "red", margin: "0px -5px" }}>
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    className={classes.commentInput}/>
                            </Paper>
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    );
}


export default Item;
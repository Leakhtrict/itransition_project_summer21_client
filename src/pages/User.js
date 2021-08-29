import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { IconButton, Button, Grid, Box, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    buttonBar: {
        color: "white",
        backgroundColor: "red",
        margin: "5px",
        padding: "6px 9px",
        '&:hover': {
            color: "red",
            backgroundColor: "white",
        },
    },
    collectionButtons: {
        margin: "5px",
        padding: "6px",
        color: "black",
    },
    usernameInfo: {
        margin: "8px 0px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
    }
}));

function User() {
    const classes = useStyles();
    const { authState } = useContext(AuthContext);
    let { userId } = useParams();
    const [thisCollections, setThisCollections] = useState([]);
    const [thisAllCollections, setThisAllCollections] = useState([]);
    const [thisUser, setThisUser] = useState({});
    let history = useHistory();

    useEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/users/byId/${userId}`)
        .then((response) => {
            if(response.data){
                setThisUser(response.data);
            } else{
                history.push("/");
            }
        });
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/${userId}`)
        .then((response) => {
            const sortedCollections = response.data.sort((a, b) => {
                return (b.id - a.id);
            });
            setThisAllCollections(sortedCollections);
            setThisCollections(sortedCollections.slice(0, 2));
        });
    }, [authState, userId]);

    const deleteCollection = (id) => {
        axios.delete(`https://itransition-project-genis.herokuapp.com/collections/${id}`,
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then(() => {
            setThisCollections(
                thisCollections.filter((val) => {
                    return val.id !== id;
                })
            );
            setThisAllCollections(
                thisAllCollections.filter((val) => {
                    return val.id !== id;
                })
            );
        });
    };

    const collectionsShowMore = () => {
        if(thisCollections.length + 4 >= thisAllCollections.length){
            setThisCollections(thisAllCollections);
        } else{
            setThisCollections(thisAllCollections.slice(0, thisCollections.length + 4))
        }
    };

    return(
        <Container maxWidth="xs" className="userPage">
            <div className={classes.usernameInfo}>
                <AccountBoxIcon fontSize="large" style={{ color: "red" }}/>
                <strong>{thisUser.username}</strong>
            </div>
            <div className="buttonBar">
                {authState.isAdmin && 
                    <Button onClick={() => {history.push("/adminpanel")}} className={classes.buttonBar}>
                        <FormattedMessage id="profile-page.adminpanel" />
                    </Button>
                }
                {((authState.id.toString() === userId) || authState.isAdmin) && 
                    <Button onClick={() => {history.push(`/user/${userId}/createcollection`)}} className={classes.buttonBar}>
                        <FormattedMessage id="profile-page.createcollection" />
                    </Button>
                }
            </div>
            <Grid container direction="column" justifyContent="center">
                {thisCollections.map((value, key) => {
                    return (
                        <div key={key}>
                            {((authState.id.toString() === userId) || authState.isAdmin) && 
                                <>
                                    <IconButton onClick={() => {history.push(`/collection/${value.id}/edit`)}} className={classes.collectionButtons}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => deleteCollection(value.id)} className={classes.collectionButtons}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                            <Grid item>
                                <Box className="collection" >
                                    <header onClick={() => {history.push(`/collection/${value.id}`)}}>
                                        <div className="collTitle">
                                            {value.title}
                                        </div>
                                        <hr />
                                        <div>
                                            <FormattedMessage id={value.theme} />
                                        </div>
                                    </header>
                                    <Container id="collectionBody" style={{ minHeight: 140, backgroundImage: `url(${value.imageURL})` }}>
                                        <ReactMarkdown>{value.description}</ReactMarkdown>
                                    </Container>
                                    <footer>
                                        <div className="collDate">
                                            <FormattedMessage id="profile-page.updatedAt" />
                                            {" " + new Date(value.updatedAt).toLocaleString()}
                                        </div>
                                        <hr />
                                        <div>
                                            {value.ownerUser}
                                        </div>
                                    </footer>
                                </Box>
                            </Grid>
                        </div>
                    );
                })}
                {!(thisCollections.length >= thisAllCollections.length) &&
                    <Button onClick={collectionsShowMore} id="submitButton" style={{ marginBottom: 8 }}>
                        <FormattedMessage id="home-page.show-more" />
                    </Button>
                }
            </Grid> 
        </Container>
    )
}

export default User;
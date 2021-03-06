import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom';
import { Edit, Delete, AccountBox } from '@material-ui/icons';
import { IconButton, Button, Grid, Box, Container } from '@material-ui/core';

import { AuthContext } from 'helpers';

const useStyles = makeStyles(() => ({
    buttonBar: {
        color: "white",
        backgroundColor: "red",
        margin: "5px",
        padding: "6px 9px",
        '&:hover': {
            color: "red",
            backgroundColor: "transparent",
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

export const User = () => {
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
        .then((response) => {
            if (response.data.error){
                localStorage.removeItem("accessToken");
                history.push("/login");
            } else{
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
            }
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
                <AccountBox fontSize="large" style={{ color: "red" }}/>
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
                        <Grid item key={key} container>
                            {((authState.id.toString() === userId) || authState.isAdmin) && 
                                <>
                                    <IconButton onClick={() => {history.push(`/collection/${value.id}/edit`)}} className={classes.collectionButtons}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => deleteCollection(value.id)} className={classes.collectionButtons}>
                                        <Delete />
                                    </IconButton>
                                </>
                            }
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

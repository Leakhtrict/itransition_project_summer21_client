import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, Button, Grid, Box, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    buttonBar: {
        color: "white",
        backgroundColor: "red",
        margin: "5px",
        padding: "6px 9px",
        '&:hover': {
            backgroundColor: "rgb(233, 102, 102)",
        },
    },
    collectionButtons: {
        margin: "5px",
        padding: "6px",
        color: "black",
    },
}));

function User() {
    const classes = useStyles();
    const { authState } = useContext(AuthContext);
    let { userId } = useParams();
    const [thisCollections, setThisCollections] = useState([]);
    let history = useHistory();

    useEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/${userId}`).then((response) => {
            setThisCollections(response.data);
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
        });
    };

    return(
        <Container maxWidth="xs">
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
            <Grid container direction="column" justifyContent="center" spacing={1}>
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
                                    <Container>
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
            </Grid> 
        </Container>
    )
}

export default User;
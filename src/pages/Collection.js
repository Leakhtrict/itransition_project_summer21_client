import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import SortSelect from "../components/SortSelect";
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, Button, Grid, Box, Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    buttonBar: {
        color: "white",
        backgroundColor: "red",
        margin: "5px 5px 10px 5px",
        padding: "6px 9px",
        '&:hover': {
            backgroundColor: "rgb(233, 102, 102)",
        },
    },
    itemButtons: {
        margin: "5px",
        padding: "6px",
        color: "black",
    },
}));

function Collection() {
    const classes = useStyles();
    const { authState } = useContext(AuthContext);
    let { id } = useParams();
    let history = useHistory();
    const [collectionObj, setCollectionObj] = useState({});
    const [thisItems, setThisItems] = useState([]);

    useEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/byIdNoAuth/${id}`).then((response) => {
            setCollectionObj(response.data);
        });

        axios.get(`https://itransition-project-genis.herokuapp.com/items/${id}`).then((response) => {
            setThisItems(response.data);
        });
    }, [id]);

    const deleteItem = (id) => {
        axios.delete(`https://itransition-project-genis.herokuapp.com/items/${id}`, 
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
              setThisItems(
                  thisItems.filter((val) => {
                      return val.id !== id;
                  })
              );
        });
    };

    return (
        <Container maxWidth="xs">
            <Grid container direction="column" justifyContent="center" alignItems="center" >
                <Grid item>
                    {(authState.id === collectionObj.UserId || authState.isAdmin) && 
                        <Button onClick={() => {history.push(`/collection/${id}/createitem`)}} className={classes.buttonBar}>
                            <FormattedMessage id="collection-page.createitem" />
                        </Button>
                    }
                </Grid>
                <Grid item>
                    <SortSelect thisItems={thisItems} setThisItems={setThisItems} />
                </Grid>
            </Grid>
            <Container maxWidth="xs" style={{ marginTop: "8px" }}>
                <Grid container direction="column" justifyContent="center" spacing={1}>
                    {thisItems.map((value, key) => {
                        const thisTags = value.tags.split(" ").slice(0, -1);
                        return (
                            <div key={key}>
                                {(authState.id === collectionObj.UserId || authState.isAdmin) && 
                                    <>
                                        <IconButton onClick={() => {history.push(`/collection/${id}/item/${value.id}/edit`)}} className={classes.itemButtons}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => deleteItem(value.id)} className={classes.itemButtons}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                                <Grid item container >
                                    <Box className="item">
                                        <header onClick={() => {history.push(`/item/${value.id}`)}}>{value.name}</header>
                                        <Grid item container style={{ margin: "10px" }} justifyContent="flex-start" alignItems="flex-start">
                                            {thisTags.map((value, key) => {
                                                return(
                                                    <Grid item key={key} onClick={() => {history.push(`/byTag/${value}`)}} className="itemTag" style={{ margin: "6px" }}>
                                                        {"#" + value}
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                        <footer>
                                            <FavoriteBorderIcon style={{ color: "red" }} />
                                            {value.Likes.length}
                                        </footer>
                                    </Box>
                                </Grid>
                            </div>
                        );
                    })}
                </Grid>
            </Container>
        </Container>
    );
}

export default Collection;
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from 'react-router-dom';
import { FavoriteBorder, Edit, Delete } from '@material-ui/icons';
import { IconButton, Button, Grid, Box, Container } from '@material-ui/core';

import { AuthContext } from 'helpers';
import { SortSelect } from 'components';

const useStyles = makeStyles(() => ({
    buttonBar: {
        color: "white",
        backgroundColor: "red",
        margin: "5px 5px 10px 5px",
        padding: "6px 9px",
        '&:hover': {
            color: "red",
            backgroundColor: "transparent",
        },
    },
    itemButtons: {
        margin: "5px",
        padding: "6px",
        color: "black",
    },
}));

export const Collection = () => {
    const classes = useStyles();
    const { authState } = useContext(AuthContext);
    let { id } = useParams();
    let history = useHistory();
    const [collectionObj, setCollectionObj] = useState({});
    const [thisItems, setThisItems] = useState([]);
    const [thisAllItems, setThisAllItems] = useState([]);

    useEffect(() => {
        axios.get(`https://itransition-project-genis.herokuapp.com/collections/byIdNoAuth/${id}`)
            .then((response) => {
                setCollectionObj(response.data);
            });

        axios.get(`https://itransition-project-genis.herokuapp.com/items/${id}`)
            .then((response) => {
                const sortedItems = response.data.sort((a, b) => {
                    return (b.id - a.id);
                });
                setThisAllItems(sortedItems);
                setThisItems(sortedItems.slice(0, 4));
            });
    }, [id]);

    const deleteItem = (id) => {
        axios.delete(`https://itransition-project-genis.herokuapp.com/items/${id}`,
            { headers: { accessToken: localStorage.getItem("accessToken") } })
            .then((response) => {
                if (response.data.error) {
                    localStorage.removeItem("accessToken");
                    history.push("/login");
                } else {
                    setThisItems(
                        thisItems.filter((val) => {
                            return val.id !== id;
                        })
                    );
                    setThisAllItems(
                        thisAllItems.filter((val) => {
                            return val.id !== id;
                        })
                    );
                }
            });
    };

    const itemsShowMore = () => {
        if (thisItems.length + 5 >= thisAllItems.length) {
            setThisItems(thisAllItems);
        } else {
            setThisItems(thisAllItems.slice(0, thisItems.length + 5))
        }
    };

    return (
        <div className="collectionPage">
            <Grid container direction="column" justifyContent="center" alignItems="center" >
                <Grid item>
                    {(authState.id === collectionObj.UserId || authState.isAdmin) &&
                        <Button onClick={() => { history.push(`/collection/${id}/createitem`) }} className={classes.buttonBar}>
                            <FormattedMessage id="collection-page.createitem" />
                        </Button>
                    }
                </Grid>
                <Grid item>
                    <SortSelect setThisItems={setThisItems} setThisAllItems={setThisAllItems} />
                </Grid>
            </Grid>
            <Container maxWidth="xs" style={{ marginTop: "8px" }}>
                <Grid container direction="column" justifyContent="center">
                    {thisItems.map((value, key) => {
                        const thisTags = value.tags.split(" ").slice(0, -1);
                        return (
                            <Grid item key={key} container>
                                {(authState.id === collectionObj.UserId || authState.isAdmin) &&
                                    <>
                                        <IconButton onClick={() => { history.push(`/collection/${id}/item/${value.id}/edit`) }} className={classes.itemButtons}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => deleteItem(value.id)} className={classes.itemButtons}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                }
                                <Box className="item">
                                    <header onClick={() => { history.push(`/item/${value.id}`) }}>{value.name}</header>
                                    <Grid item container style={{ margin: "10px" }} justifyContent="flex-start" alignItems="flex-start">
                                        {thisTags.map((value, key) => {
                                            return (
                                                <Grid item key={key} onClick={() => { history.push(`/byTag/${value}`) }} className="itemTag" style={{ margin: "6px" }}>
                                                    {"#" + value}
                                                </Grid>
                                            )
                                        })}
                                    </Grid>
                                    <footer>
                                        <FavoriteBorder style={{ color: "red" }} />
                                        {value.Likes.length}
                                    </footer>
                                </Box>
                            </Grid>
                        );
                    })}
                    {!(thisItems.length >= thisAllItems.length) &&
                        <Button onClick={itemsShowMore} id="submitButton" style={{ marginBottom: 8 }}>
                            <FormattedMessage id="home-page.show-more" />
                        </Button>
                    }
                </Grid>
            </Container>
        </div>

    );
}

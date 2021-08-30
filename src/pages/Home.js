import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MainTagCloud from "../components/MainTagCloud";
import { FormattedMessage } from "react-intl";
import { Button, Grid, Box, Container } from "@material-ui/core";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function Home() {
    const { authState, setAuthState } = useContext(AuthContext);
    const [listOfCollections, setListOfCollections] = useState([]);
    const [listOfAllCollections, setListOfAllCollections] = useState([]);
    const [listOfItems, setListOfItems] = useState([]);
    const [listOfAllItems, setListOfAllItems] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);

    let history = useHistory();

    useEffect(() => {
        axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
            if (response.data.error) {
                localStorage.removeItem("accessToken");
                setAuthState({...authState, status: false});
            } else {
                setAuthState({
                  username: response.data.username,
                  id: response.data.id,
                  isAdmin: response.data.isAdmin,
                  status: true,
                });
            }
        });


        axios.get("https://itransition-project-genis.herokuapp.com/collections")
        .then((response) => {
            const collectionsSorted = response.data.sort((a, b) => {
                return (b.numberOfItems - a.numberOfItems);
            });
            setListOfAllCollections(collectionsSorted);
            setListOfCollections(collectionsSorted.slice(0, 3));
        });

        axios.get("https://itransition-project-genis.herokuapp.com/items")
        .then((response) => {
            const allItems = response.data.sort((a, b) => {
                return b.updatedAt.localeCompare(a.updatedAt);
            });
            setListOfAllItems(allItems);
            setListOfItems(allItems.slice(0, 4));
        });

        axios.get("https://itransition-project-genis.herokuapp.com/tags")
        .then((response) => {
            response.data.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, count: 0 }]);
                return value;
            });
            setListOfTags(prevState => shuffle(prevState));
        });
    }, []);
  
    const collectionsShowMore = () => {
        if(listOfCollections.length + 5 >= listOfAllCollections.length){
            setListOfCollections(listOfAllCollections);
        } else{
            setListOfCollections(listOfAllCollections.slice(0, listOfCollections.length + 5))
        }
    };

    const itemsShowMore = () => {
        if(listOfItems.length + 5 >= listOfAllItems.length){
            setListOfItems(listOfAllItems);
        } else{
            setListOfItems(listOfAllItems.slice(0, listOfItems.length + 5))
        }
    };

    return (
        <div className="homePage">
            <Grid container direction="row" justifyContent="center">
                <Container maxWidth="xs" style={{ marginTop: 8 }}>
                    <Grid item xs={12} container direction="column" justifyContent="center">
                        {listOfCollections.map((value, key) => {
                            return (
                                <Grid item key={key}>
                                    <Box className="collection" style={{ backgroundImage: `url(${value.imageURL})` }}>
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
                        {!(listOfCollections.length >= listOfAllCollections.length) &&
                            <Button onClick={collectionsShowMore} id="submitButton" style={{ marginBottom: 8 }}>
                                <FormattedMessage id="home-page.show-more" />
                            </Button>
                        }
                    </Grid>
                </Container>
                <Container maxWidth="xs">
                    {listOfTags && 
                        <MainTagCloud data={listOfTags} />
                    }
                    <Grid item xs={12} container direction="column" justifyContent="center">
                        {listOfItems.map((value, key) => {
                            const thisTags = value.tags.split(" ").slice(0, -1);
                            return (
                                <Grid item key={key} container>
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
                            );
                        })}
                        {!(listOfItems.length >= listOfAllItems.length) &&
                            <Button onClick={itemsShowMore} id="submitButton" style={{ marginBottom: 8 }}>
                                <FormattedMessage id="home-page.show-more" />
                            </Button>
                        }
                    </Grid>
                </Container>
            </Grid>
        </div>
    );
}

export default Home;
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MainTagCloud from "../components/MainTagCloud";
import { FormattedMessage } from "react-intl";
import { Grid, Box, Container } from "@material-ui/core";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function Home() {
    const [listOfCollections, setListOfCollections] = useState([]);
    const [listOfItems, setListOfItems] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);

    let history = useHistory();

    useEffect(() => {
        axios.get("https://itransition-project-genis.herokuapp.com/collections").then((response) => {
            setListOfCollections(response.data.sort((a, b) => {
                return (b.numberOfItems - a.numberOfItems);
            }).slice(0, 10));
        });

        axios.get("https://itransition-project-genis.herokuapp.com/items").then((response) => {
            setListOfItems(response.data.reverse().slice(0, 15));
        });

        axios.get("https://itransition-project-genis.herokuapp.com/tags").then((response) => {
            response.data.map((value) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, count: 0 }]);
                return value;
            });
            
        });
    }, []);
  
    return (
        <div className="homePage">
            <Grid container direction="row" justifyContent="center">
                <Container maxWidth="xs">
                    <Grid item xs={12} container direction="column" justifyContent="center">
                        {listOfCollections.map((value, key) => {
                            return (
                                <Grid item key={key}>
                                    <Box className="collection" >
                                        <header onClick={() => {history.push(`/collection/${value.id}`)}}>
                                            <div className="collTitle">
                                                {value.title}
                                            </div>
                                            <hr />
                                            <div>
                                                {value.theme}
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
                            );
                        })}
                    </Grid>
                </Container>
                <Container maxWidth="xs">
                    {listOfTags && 
                        <MainTagCloud data={listOfTags} />
                    }
                    <hr />
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
                    </Grid>
                </Container>
            </Grid>
        </div>
    );
}

export default Home;
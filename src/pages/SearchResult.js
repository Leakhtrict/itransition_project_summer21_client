import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Box, Container, Button } from "@material-ui/core";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { FormattedMessage } from "react-intl";
import SortSelect from "../components/SortSelect";

function SearchResult() {
    let { word } = useParams();
    let history = useHistory();
    const [listOfItems, setListOfItems] = useState([]);
    const [listOfAllItems, setListOfAllItems] = useState([]);

    useEffect(() => {
        axios.get("https://itransition-project-genis.herokuapp.com/items").then((response) => {
            const filteredItems = response.data.filter((value) => {
                return value.name.toLowerCase().includes(word.toLowerCase())
                || value.tags.toLowerCase().includes(word.toLowerCase());
            }).sort((a, b) => {
                return (b.id - a.id);
            });
            setListOfAllItems(filteredItems);
            setListOfItems(filteredItems.slice(0, 5));
        });
    }, [word]);

    const itemsShowMore = () => {
        if(listOfItems.length + 5 >= listOfAllItems.length){
            setListOfItems(listOfAllItems);
        } else{
            setListOfItems(listOfAllItems.slice(0, listOfItems.length + 5))
        }
    };

    return (
        <div className="tagCloudResult">
            {listOfItems.length ?
                <>
                    <FormattedMessage id="searchresult-page.result">
                        {(id) =>
                            <div style={{ fontSize: 18, marginBottom: 8 }}>{id + " \"" + word + "\""}</div>
                        }
                    </FormattedMessage>
                    <SortSelect thisItems={listOfItems} setThisItems={setListOfItems} />
                </> : 
                <FormattedMessage id="searchresult-page.result.notfound">
                    {(id) =>
                        <div style={{ fontSize: 18 }}>{id + " \"" + word + "\""}</div>
                    }
                </FormattedMessage>
            }
            <Container maxWidth="xs" style={{ marginTop: "8px" }}>
                <Grid item container direction="column" justifyContent="center" spacing={1}>
                    {listOfItems.map((value, key) => {
                        const thisTags = value.tags.split(" ").slice(0, -1);
                        return (
                            <Grid key={key} item container>
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
        </div>
    )
}

export default SearchResult;
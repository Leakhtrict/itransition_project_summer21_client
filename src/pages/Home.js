import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MainTagCloud from "../components/MainTagCloud";
import { FormattedMessage } from "react-intl";
import { Grid, Box, Container } from "@material-ui/core";

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
            response.data.map((value, key) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, count: 0 }]);
            });
            
        });
    }, []);
  
    return (
        <div className="homePage">
            <Container maxWidth="xs">
                <Grid container direction="column" justifyContent="center" spacing={1}>
                    {listOfCollections.map((value, key) => {
                        return (
                            <Grid item>
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
                                    <body>
                                        <Container>
                                            <ReactMarkdown>{value.description}</ReactMarkdown>
                                        </Container>
                                    </body>
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
            <div className="itemsRightSide">
                {listOfTags && 
                    <MainTagCloud data={listOfTags} />
                }
                {listOfItems.map((value, key) => {
                    return (
                        <div key={key} className="item" onClick={() => {history.push(`/item/${value.id}`)}}>
                            <div className="title"> {value.name} </div>
                            <div className="theme"> {value.tags} </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
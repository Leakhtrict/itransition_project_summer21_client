import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import MainTagCloud from "../components/MainTagCloud";

function Home() {
    const [listOfCollections, setListOfCollections] = useState([]);
    const [listOfItems, setListOfItems] = useState([]);
    const [listOfTags, setListOfTags] = useState([]);

    let history = useHistory();

    useEffect(() => {
        axios.get("https://itransition-project-genis.herokuapp.com/collections").then((response) => {
            setListOfCollections(response.data.sort((a, b) => {
                return (b.numberOfItems - a.numberOfItems);
            }).slice(0, 6));
        });

        axios.get("https://itransition-project-genis.herokuapp.com/items").then((response) => {
            setListOfItems(response.data.reverse().slice(0, 10));
        });

        axios.get("https://itransition-project-genis.herokuapp.com/tags").then((response) => {
            response.data.map((value, key) => {
                setListOfTags(prevState => [...prevState, { value: value.tagName, count: 0 }]);
            });
            
        });
    }, []);
  
    return (
        <div className="homePage">
            <div className="collectionsLeftSide">
                {listOfCollections.map((value, key) => {
                    return (
                        <div key={key} className="collection" onClick={() => {history.push(`/collection/${value.id}`)}}>
                            <div className="title"> {value.title} </div>
                            <div className="theme"> {value.theme} </div>
                            <div className="desc"> <ReactMarkdown>{value.description}</ReactMarkdown> </div>
                            <div className="username"> {value.ownerUser} </div>
                        </div>
                    );
                })}
            </div>
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
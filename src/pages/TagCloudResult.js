import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

function TagCloudResult() {
    let { tag } = useParams();
    let history = useHistory();
    const [listOfItems, setListOfItems] = useState([]);

    useEffect(() => {
        axios.get("https://itransition-project-genis.herokuapp.com/items").then((response) => {
            setListOfItems(response.data.filter((value) => {
                return value.tags.includes(tag + " ");
            }));
        });
    }, [tag]);

    return (
        <div className="tagCloudResult">
            {listOfItems.map((value, key) => {
                return (
                    <div key={key} className="item" onClick={() => {history.push(`/item/${value.id}`)}}>
                        <div className="title"> {value.name} </div>
                        <div className="theme"> {value.tags} </div>
                    </div>
                );
            })}
        </div>
        
    )
}

export default TagCloudResult;
import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { FormattedMessage } from "react-intl";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import SortSelect from "../components/SortSelect";

function Collection() {
    const { authState } = useContext(AuthContext);
    let { id } = useParams();
    let history = useHistory();
    const [collectionObj, setCollectionObj] = useState({});
    const [thisItems, setThisItems] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3001/collections/byIdNoAuth/${id}`).then((response) => {
            setCollectionObj(response.data);
        });

        axios.get(`http://localhost:3001/items/${id}`).then((response) => {
            setThisItems(response.data);
        });
    }, [id]);

    const deleteItem = (id) => {
        axios.delete(`http://localhost:3001/items/${id}`, 
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then(() => {
              setThisItems(
                  thisItems.filter((val) => {
                      return val.id !== id;
                  })
              );
        });
    };

    const likeItem = (itemId) => {
        axios.post("http://localhost:3001/likes", 
        { ItemId: itemId }, 
        { headers: { accessToken: localStorage.getItem("accessToken") } }
        ).then((response) => {
            if(!response.data.error){
                setThisItems(thisItems.map((item) => {
                    if (item.id === itemId){
                        if (response.data.liked){
                            return {...item, Likes: [...item.Likes, 0]};
                        } else{
                            const allLikes = item.Likes;
                            allLikes.pop();
                            return {...item, Likes: allLikes};
                        }
                    } else{
                        return item;
                    }
                }));
            } 
        });
    };

    return (
        <div>
            <SortSelect thisItems={thisItems} setThisItems={setThisItems} />
            {(authState.id === collectionObj.UserId || authState.isAdmin) && 
            <button onClick={() => {history.push(`/collection/${id}/createitem`)}}>
                <FormattedMessage id="collection-page.createitem" />
            </button>}
            {thisItems.map((value, key) => {
                return (
                    <div key={key}>
                        {(authState.id === collectionObj.UserId || authState.isAdmin) && 
                            <>
                                <button onClick={() => {history.push(`/collection/${id}/item/${value.id}/edit`)}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                    </svg>
                                </button>
                                <button onClick={() => deleteItem(value.id)}> X</button>
                            </>
                        }
                        <div className="item" onClick={() => {history.push(`/item/${value.id}`)}}>
                            <div className="name"> {value.name} </div>
                            <div className="tags"> {value.tags} </div>
                        </div>
                        <button className="likeButton" onClick={() => {likeItem(value.id)}}>
                            <FavoriteBorderIcon />
                            {value.Likes.length}
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default Collection;
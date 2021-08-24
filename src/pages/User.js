import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

function User() {
    const { authState } = useContext(AuthContext);
    let { userId } = useParams();
    const [thisCollections, setThisCollections] = useState([]);
    let history = useHistory();

    useEffect(() => {
        axios.get(`http://localhost:3001/collections/${userId}`).then((response) => {
            console.log(userId, response.data, authState);
            setThisCollections(response.data);
        });
    }, [authState, userId]);

    const deleteCollection = (id) => {
        axios.delete(`http://localhost:3001/collections/${id}`, {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          })
          .then(() => {
              setThisCollections(
                  thisCollections.filter((val) => {
                      return val.id !== id;
                  })
              );
        });
    };

    return(
        <div>
            {authState.isAdmin && 
                <button onClick={() => {history.push("/adminpanel")}}>
                    <FormattedMessage id="profile-page.adminpanel" />
                </button>
            }
            {((authState.id.toString() === userId) || authState.isAdmin) && 
                <button onClick={() => {history.push(`/user/${userId}/createcollection`)}}>
                    <FormattedMessage id="profile-page.createcollection" />
                </button>
            }
            {thisCollections.map((value, key) => {
                return (
                    <div key={key}>
                        {((authState.id.toString() === userId) || authState.isAdmin) && 
                            <>
                                <EditIcon onClick={() => {history.push(`/collection/${value.id}/edit`)}} />
                                <DeleteIcon onClick={() => deleteCollection(value.id)} />
                            </>
                        }
                        <div className="collection" onClick={() => {history.push(`/collection/${value.id}`)}}>
                            <div className="title"> {value.title} </div>
                            <div className="theme"> {value.theme} </div>
                            <div className="desc"> <ReactMarkdown>{value.description}</ReactMarkdown> </div>
                            <div className="username"> {value.ownerUser} </div>
                        </div>
                    </div>
                    
                );
            })}
        </div>
    )
}

export default User;
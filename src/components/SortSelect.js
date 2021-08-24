import React from "react";
import { FormattedMessage } from "react-intl";
import ImportExportIcon from '@material-ui/icons/ImportExport';

export default function SortSelect({
    thisItems,
    setThisItems
}){
    const sortByValue = (value) => {
        switch(value){
            case "id":
                setThisItems(prevState => [...prevState].sort((a, b) => {
                    return (a.id - b.id);
                }));
                break;
            case "name":
                setThisItems(prevState => [...prevState].sort((a, b) => a.name.localeCompare(b.name)));
                break;
            case "likes":
                setThisItems(prevState => [...prevState].sort((a, b) => {
                    return (b.Likes.length - a.Likes.length);
                }));
                break;
        }
    };

    const reverseItems = () => {
        setThisItems(prevState => [...prevState].reverse());
    };

    return(
        <div className="sortSelect">
            <FormattedMessage id="sortselect.sortBy"/>
            <select onChange={(e) => sortByValue(e.target.value)}>
                <FormattedMessage id="sortselect.createdAt">
                    {(id) => 
                        <option value="id" selected="selected">{id}</option>
                    }
                </FormattedMessage>
                <FormattedMessage id="sortselect.name">
                    {(id) => 
                        <option value="name">{id}</option>
                    }
                </FormattedMessage>
                <FormattedMessage id="sortselect.likes">
                    {(id) => 
                        <option value="likes">{id}</option>
                    }
                </FormattedMessage>
            </select>
            <ImportExportIcon onClick={() => reverseItems()} />
        </div>
    );
}
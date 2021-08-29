import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Select, MenuItem, InputLabel, FormControl, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    buttons: {
        margin: "5px -5px",
        padding: "6px",
        color: "black",
    },
}));

export default function SortSelect({ setThisItems, setThisAllItems }){
    const classes = useStyles();
    const [sortFilter, setSortFilter] = useState("id");
    const sortByValue = (value) => {
        switch(value){
            case "id":
                setThisAllItems(prevAllState => {
                    const sortedList = [...prevAllState].sort((a, b) => {
                        return (b.id - a.id);
                    });
                    setThisItems(prevState => sortedList.slice(0, prevState.length));
                    return sortedList;
                });
                break;
            case "updatedAt":
                setThisAllItems(prevState => {
                    const sortedList = [...prevState].sort((a, b) => {
                        return b.updatedAt.localeCompare(a.updatedAt);
                    });
                    setThisItems(prevState => sortedList.slice(0, prevState.length));
                    return sortedList;
                });
                break;
            case "name":
                setThisAllItems(prevState => {
                    const sortedList = [...prevState].sort((a, b) => a.name.localeCompare(b.name));
                    setThisItems(prevState => sortedList.slice(0, prevState.length));
                    return sortedList;
                });
                break;
            case "likes":
                setThisAllItems(prevState => {
                    const sortedList = [...prevState].sort((a, b) => {
                        return (b.Likes.length - a.Likes.length);
                    });
                    setThisItems(prevState => sortedList.slice(0, prevState.length));
                    return sortedList;
                });
                break;
            default:
                break;
        }
    };

    const handleChange = (event) => {
        setSortFilter(event.target.value);
        sortByValue(event.target.value);
    }

    const reverseItems = () => {
        setThisAllItems(prevAllState => {
            const sortedList = [...prevAllState].reverse();
            setThisItems(prevState => sortedList.slice(0, prevState.length));
            return sortedList;
        });
    };

    return(
        <div style={{ border: "solid 2px red", borderRadius: 8, padding: 8, backgroundColor: "white" }}>
            <FormControl className="sortSelect">
                <FormattedMessage id="sortselect.sortBy">
                    {(id) => 
                        <InputLabel id="sort-select-label">{id}</InputLabel>
                    }
                </FormattedMessage>
                <Select
                    labelId="sort-select-label"
                    value={sortFilter}
                    onChange={handleChange}
                >
                    <MenuItem value="id">
                        <FormattedMessage id="sortselect.createdAt" />
                    </MenuItem>
                    <MenuItem value="updatedAt">
                        <FormattedMessage id="sortselect.updatedAt" />
                    </MenuItem>
                    <MenuItem value="name">
                        <FormattedMessage id="sortselect.name" />
                    </MenuItem>
                    <MenuItem value="likes">
                        <FormattedMessage id="sortselect.likes" />
                    </MenuItem>
                </Select>
            </FormControl>
            <IconButton onClick={() => reverseItems()} className={classes.buttons}>
                <ImportExportIcon />
            </IconButton>
        </div>
    );
}
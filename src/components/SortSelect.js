import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Select, MenuItem, InputLabel, FormControl, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    buttons: {
        margin: "5px",
        padding: "6px",
        color: "black",
    },
}));

export default function SortSelect({
    thisItems,
    setThisItems
}){
    const classes = useStyles();
    const [sortFilter, setSortFilter] = useState("id");
    const sortByValue = (value) => {
        switch(value){
            case "id":
                setThisItems(prevState => [...prevState].sort((a, b) => {
                    return (a.id - b.id);
                }));
                break;
            case "updatedAt":
                setThisItems(prevState => [...prevState].sort((a, b) => {
                    return b.updatedAt.localeCompare(a.updatedAt);
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
            default:
                break;
        }
    };

    const handleChange = (event) => {
        setSortFilter(event.target.value);
        sortByValue(event.target.value);
    }

    const reverseItems = () => {
        setThisItems(prevState => [...prevState].reverse());
    };

    return(
        <div style={{ border: "solid 2px red", borderRadius: 8, padding: 8 }}>
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
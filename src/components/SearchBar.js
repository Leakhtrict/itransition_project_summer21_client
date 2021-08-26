import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import OutsideClickHandler from 'react-outside-click-handler';
import "./SearchBar.css";

function SearchBar({ data }) {
    let history = useHistory();
    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");
  
    const handleFilter = (event) => {
      const searchWord = event.target.value;
      setWordEntered(searchWord);
      const newFilter = data.filter((value) => {
        return value.name.toLowerCase().includes(searchWord.toLowerCase())
        || value.tags.toLowerCase().includes(searchWord.toLowerCase());
      });
  
      if (searchWord === "") {
        setFilteredData([]);
      } else {
        setFilteredData(newFilter);
      }
    };
  
    const handleKeyDown = (e) => {
      if(e.key === "Enter"){
        clearInput();
        history.push(`/searchResult/${wordEntered}`);
      }
    };

    const clearInput = () => {
      setFilteredData([]);
      setWordEntered("");
    };
  
    return (
      <div className="search">
        <div className="searchInputs">
          <FormattedMessage id="searchbar.placeholder">
            {(id) => 
              <input
                type="text"
                placeholder={id}
                value={wordEntered}
                onChange={handleFilter}
                onKeyDown={handleKeyDown}
              />
            }
          </FormattedMessage>
          
          <div className="searchIcon">
            {wordEntered.length === 0 ? (
              <SearchIcon />
            ) : (
              <CloseIcon id="clearBtn" onClick={clearInput} />
            )}
          </div>
        </div>
        {filteredData.length !== 0 && (
          <OutsideClickHandler onOutsideClick={() => setFilteredData([])}>
            <div className="dataResult">
            {filteredData.slice(0, 10).map((value, key) => {
              return (
                <div className="dataItem" onClick={() => {
                    history.push(`/item/${value.id}`);
                    clearInput();
                  }} >
                  <p>{value.name} </p>
                </div>
              );
            })}
          </div>
          </OutsideClickHandler>
        )}
      </div>
    );
  }
  
  export default SearchBar;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IntlProvider } from 'react-intl';
import { Toolbar, AppBar } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {
  Collection,
  CreateCollection,
  CreateItem,
  EditCollection,
  EditItem,
  Home,
  Item,
  SearchResult,
  TagCloudResult,
  User,
  WrongPath
} from 'pages';
import { AuthContext } from 'helpers';
import enMessages from 'lang/en.json';
import ruMessages from 'lang/ru.json';
import { Login, Register, AdminPanel } from 'authPages';
import { LangChanger, LogOut, NavigationMenu, ProfileLink, SearchBar } from 'components';

import './App.css';

const langSet = {
  "en": enMessages,
  "ru": ruMessages
}

function App() {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("app.lang") || "en");
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    isAdmin: false,
    status: false,
  });
  const [listOfItems, setListOfItems] = useState([]);

  useEffect(() => {
    axios.get("https://itransition-project-genis.herokuapp.com/users/auth",
    { headers: { accessToken: localStorage.getItem("accessToken") } })
    .then((response) => {
        if (response.data.error) {
          localStorage.removeItem("accessToken");
          setAuthState({...authState, status: false});
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            isAdmin: response.data.isAdmin,
            status: true,
          });
        }
    });

    axios.get("https://itransition-project-genis.herokuapp.com/items")
    .then((response) => {
      setListOfItems(response.data);
    });
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <IntlProvider locale={currentLang} messages={langSet[currentLang]}>
          <Router>
            <AppBar
              style={{ backgroundColor: "red", height: "50px", justifyContent: "center", marginBottom: "8px", position: "fixed" }}>
              <Toolbar className="navBar" style={{ margin: "0px -10px" }}>
                <NavigationMenu authState={authState} />
                {!authState.status ? (
                  <div style={{ margin: "0px auto 0px 0px" }}>
                      <SearchBar data={listOfItems}/>
                  </div>
                ) : (
                  <>
                    <div style={{ margin: "0px auto 0px 0px" }}>
                      <SearchBar data={listOfItems} />
                    </div>
                    <ProfileLink authState={authState} />
                    <LogOut setAuthState={setAuthState} />
                  </>
                )}
                </Toolbar>
            </AppBar>
            
            <div style={{ marginTop: 58 }} />
            <Switch className="shownPage">
              <Route path="/" exact component={Home} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/adminpanel" exact component={AdminPanel} />
              <Route path="/user/:userId" exact component={User} />
              <Route path="/user/:id/createcollection" exact component={CreateCollection} />
              <Route path="/collection/:id" exact component={Collection} />
              <Route path="/collection/:id/edit" exact component={EditCollection} />
              <Route path="/collection/:id/createitem" exact component={CreateItem} />
              <Route path="/item/:itemId" exact component={Item} />
              <Route path="/collection/:collectionId/item/:itemId/edit" exact component={EditItem} />
              <Route path="/byTag/:tag" exact component={TagCloudResult} />
              <Route path="/searchResult/:word" exact component={SearchResult} />
              <Route path="*" exact component={WrongPath} />
            </Switch>
          </Router>
          <LangChanger currentLang={currentLang} setCurrentLang={setCurrentLang} />
        </IntlProvider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

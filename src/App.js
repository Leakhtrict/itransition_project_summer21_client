import './App.css';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormattedMessage, IntlProvider } from "react-intl";
import enMessages from "./lang/en.json";
import ruMessages from "./lang/ru.json";
import Home from "./pages/Home";
import CreateCollection from "./pages/CreateCollection";
import Collection from './pages/Collection';
import EditCollection from './pages/EditCollection';
import CreateItem from "./pages/CreateItem";
import Item from "./pages/Item";
import EditItem from './pages/EditItem';
import User from './pages/User';
import LangChanger from "./components/LangChanger";
import LogOut from "./components/LogOut";
import ProfileLink from './components/ProfileLink';
import Login from './authPages/Login';
import Register from "./authPages/Register";
import AdminPanel from './authPages/AdminPanel';
import { AuthContext } from "./helpers/AuthContext";
import SearchBar from './components/SearchBar';
import TagCloudResult from "./pages/TagCloudResult";
import SearchResult from './pages/SearchResult';
import NavigationMenu from './components/NavigationMenu';
import { Toolbar, AppBar, Button, IconButton } from '@material-ui/core';

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

    axios.get("https://itransition-project-genis.herokuapp.com/items").then((response) => {
      setListOfItems(response.data);
    });
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <IntlProvider locale={currentLang} messages={langSet[currentLang]}>
          <Router>
            <AppBar position="static" style={{ backgroundColor: "red", height: "50px", justifyContent: "center", marginBottom: "8px" }}>
              <Toolbar className="navBar" style={{ marginLeft: "-10px" }}>
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
            
            
            <Switch>
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
            </Switch>
          </Router>
          <LangChanger currentLang={currentLang} setCurrentLang={setCurrentLang} />
        </IntlProvider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

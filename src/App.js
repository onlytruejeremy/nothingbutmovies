import React from "react";
import "./styles.css";
import Main from "./components/Main";
import { Route, Switch } from "react-router-dom";
import DetailsClass from "./components/views/DetailsClass";
import MainCards from "./components/views/MainCards";
import Account from "./components/account/Account";
import PrivateRoute from "./PrivateRoute";
import Login from "./components/account/Login";
import Favourites from "./components/views/Favourites";
export default function App() {
  return (
    <div className="App">
      <Main />
      <Switch>
        <Route path="/details/:id">
          <DetailsClass />
        </Route>
        <Route path="/" exact>
          <MainCards />
        </Route>
        <PrivateRoute path="/account" component={Account}></PrivateRoute>
        <PrivateRoute path="/favourites" component={Favourites}></PrivateRoute>
        <Route path="/login" exact>
          <Login />
        </Route>
      </Switch>
    </div>
  );
}

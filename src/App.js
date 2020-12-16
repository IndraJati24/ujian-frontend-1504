import React from "react";
import Axios from "axios";
import{connect} from "react-redux"
import { Route, Switch } from "react-router-dom";
import {login} from "./action"

import Navigation from "./component/navbar";


import Home from "./page/home";
import Login from "./page/login";
import CartPage from "./page/cartPage"
import History from "./page/history"


class App extends React.Component {
  componentDidMount() {
    Axios.get(`http://localhost:2000/users?email=${localStorage.email}`)
      .then((res) => {
        this.props.login(res.data[0]);
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div>
        <Navigation />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/cart" component={CartPage} exact />
          <Route path="/history" component={History} exact />
        </Switch>
      </div>
    );
  }
}

export default connect(null, {login}) (App);

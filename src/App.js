import "antd/dist/antd.css";
import React, { useLayoutEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import Checkout from "./components/Checkout";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import Thanks from "./components/Thanks";
import routes from "./config";

export const config = {
  endpoint: `https://backend-of-ecom-kart.herokuapp.com/api/v1`,
};

export default function App(props) {
  const location = useLocation();
  // Scroll to top if path changes
  useLayoutEffect(() => {
    window && window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="App">
      <Switch>
        <Route exact path={routes.registerRoute}>
          <Register />
        </Route>
        <Route exact path={routes.loginRoute}>
          <Login />
        </Route>
        <Route path={routes.productsRoute}>
          <Search />
        </Route>

        <Route path={routes.checkoutRoute}>
          <Checkout />
        </Route>

        <Route path={routes.thanksRoute}>
          <Thanks />
        </Route>


        <Route path={routes.homeRoute}>
          <Home />
        </Route>
      </Switch>


    </div>
  );
}

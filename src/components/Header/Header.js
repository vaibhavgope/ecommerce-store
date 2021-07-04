import React from "react";
import "./Header.css";
import LoggedOutView from "./LoggedOutView";
import LoggedInView from "./LoggedInView";
import routes from "../../config/config";

export default class Header extends React.Component {
  root = () => {
    this.props.history.push(routes.homeRoute);
  };

  explore = () => {
    this.props.history.push(routes.productsRoute);
  };

  register = () => {
    this.props.history.push(routes.registerRoute);
  };

  login = () => {
    this.props.history.push(routes.loginRoute);
  };

  logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    this.props.history.push(routess.homeRoute);
  };

  render() {
    return (
      <div className="header">
        {/* Shows Qkart title image */}
        <div className="header-title" onClick={this.root}>
          <img src="icon.svg" alt="QKart-icon"></img>
        </div>

        <div>{this.props.children}</div>

        {/* Display links based on if the user's logged in or not */}
        <div className="header-action">
          {localStorage.getItem("username") ? (
            <LoggedInView logout={this.logout} explore={this.explore} />
          ) : (
            <LoggedOutView login={this.login} explore={this.explore} register={this.register} />
          )}
        </div>
      </div>
    );
  }
}

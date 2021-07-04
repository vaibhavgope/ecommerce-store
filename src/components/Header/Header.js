import React from "react";
import "./Header.css";
import LoggedOutView from "./LoggedOutView";
import LoggedInView from "./LoggedInView";

export default class Header extends React.Component {
  root = () => {
    this.props.history.push("/");
  };

  explore = () => {
    this.props.history.push("/products");
  };

  register = () => {
    this.props.history.push("/register");
  };

  login = () => {
    this.props.history.push("/login");
  };

  logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    this.props.history.push("/");
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

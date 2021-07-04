import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import routes from "../config/config"

export default function App() {
  return (
    <>
      {/* Display "Home" page content */}
      <div className="flex-container">
        <div className="home-container container">
          <h1 className="home-welcome-text">
            Welcome to <img src="icon.svg" alt="QKart"></img>
          </h1>

          <p>Please select an option from below</p>

          <div className="home-buttons">
            <Link to={routes.registerRoute}>
              <Button id="register-button" className="btn-block" type="primary" block={true}>
                Register
              </Button>
            </Link>
            <Link to={routes.loginRoute}>
              <Button id="login-button" className="btn-block" type="primary" block={true}>
                Login
              </Button>
            </Link>

            <Link to={routes.registerRoute}>
              <Button className="btn-block" type="primary" block={true}>
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header/Header";
import makeApiCall from "../utils/makeApiCall";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
    };
  }


  performAPICall = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await makeApiCall(`${config.endpoint}/auth/login`, "POST", {
        "Content-type": "application/json; charset=UTF-8",
      }, {
        username: this.state.username,
        password: this.state.password,
      })
    } catch (error) {
      errored = true;
    }
    this.setState({
      loading: false,
    });
    if (this.validateResponse(errored, response))
      return response;
    return null;
  };


  validateInput = () => {
    let flag = false;
    if (this.state.username.length === 0) message.info('Username cannot be empty.');
    else if (this.state.password.length === 0) message.info('Password cannot be empty.')
    else flag = true;
    return flag;
  };


  validateResponse = (errored, response) => {
    if (errored) {
      message.error("Error occured");
      return false;
    } else if (response["success"] === false) {
      message.error(response["message"] || "Some Unkown error occured while logging in.");
      return false;
    } else return true;
  };

  persistLogin = (token, username, balance) => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('username', username);
    window.localStorage.setItem('balance', balance);
  };


  login = async () => {
    if (this.validateInput()) {
      const response = await this.performAPICall();

      if (response) {
        this.persistLogin(response.token, response.username, response.balance);
        this.setState((state, props) => {
          return { username: "", password: "", confirmPassword: "" };
        })
        message.info("User Logged In!");
        this.props.history.push('/products');
      }
    }
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display Login fields */}
        <div className="flex-container">
          <div className="login-container container">
            <h1>Login to QKart</h1>

            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />

            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />

            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.login}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Login);
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header/Header";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
      confirmPassword: "",
    };
  }


  performAPICall = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });
    try {
      response = await fetch(`${config.endpoint}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),

        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }).then(resp => resp.json());
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
    if (this.state.username.length === 0) message.info('Username cannot be empty.')
    else if (this.state.username.length < 6) message.info('Username too short.')
    else if (this.state.username.length > 32) message.info('Username too long.')
    else if (this.state.password.length === 0) message.info('Password cannot be empty.')
    else if (this.state.password.length < 6) message.info('Password too short.')
    else if (this.state.password.length > 32) message.info('Password too long.')
    else if (this.state.password !== this.state.confirmPassword) message.info('Passwords do not match.')
    else flag = true;

    return flag;
  };


  validateResponse = (errored, response) => {
    if (errored) {
      message.info("Error occured");
      return false;
    } else if (response["success"] === false) {
      message.info(response["message"]);
      return false;
    } else return true;
  };

  register = async () => {
    if (this.validateInput()) {
      const response = await this.performAPICall();
      if (response !== null) {
        this.setState((state, props) => {
          return { username: "", password: "", confirmPassword: "" };
        })
        message.info("User Registered!");
        this.props.history.push('/login');
      }
    }
  };

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display Register fields */}
        <div className="flex-container">
          <div className="register-container container">
            <h1>Make an account</h1>

            {/* Antd component which renders a formatted <input type="text"> field */}
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

            {/* Antd component which renders a formatted <input type="password"> field */}
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

            {/* Antd component which renders a formatted <input type="password"> field */}
            <Input.Password
              className="input-field"
              placeholder="Confirm Password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              onChange={(e) => {
                this.setState({
                  confirmPassword: e.target.value,
                });
              }}
            />

            {/* Antd component which renders a formatted <button type="button"> field */}
            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.register}
            >
              Register
            </Button>
          </div>
        </div>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Register);

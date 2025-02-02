import { Button } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import routes from "../config/config";
import Header from "./Header/Header";
import "./Thanks.css";

class Thanks extends React.Component {

  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display order details */}
        <div className="thanks-container">
          <h1 style={{ fontWeight: "600" }}>It's ordered!</h1>

          <div className="green-text thanks-line">
            You will receive an invoice for your order shortly.
            <br />
            Your order will arrive in 7 business days.
          </div>

          <div className="thanks-line">
            Wallet balance: <br></br>₹{localStorage.getItem("balance")}{" "} available
          </div>

          <Link to={routes.productsRoute} className="thanks-line">
            <Button type="primary">Browse for more products</Button>
          </Link>
        </div>
      </>
    );
  }
}

export default withRouter(Thanks);

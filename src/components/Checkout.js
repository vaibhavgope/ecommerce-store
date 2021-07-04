import { Button, message, Radio, Row, Col } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Cart from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header/Header";


class Checkout extends React.Component {
  constructor() {
    super();
    this.cartRef = React.createRef();
    this.state = {
      products: [],
      addresses: [],
      selectedAddressIndex: 0,
      newAddress: "",
      balance: 0,
      loading: false,
    };
  }


  validateGetProductsResponse = (errored, response) => {
    if (errored || (!response.length && !response.message)) {
      message.error(
        "Could not fetch products. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }

    if (!response.length) {
      message.error(response.message || "No products found in database");
      return false;
    }

    return true;
  };


  getProducts = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (await fetch(`${config.endpoint}/products`)).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateGetProductsResponse(errored, response)) {
      if (response) {
        this.setState({
          products: response,
        });
      }
    }
  };


  validateResponse = (errored, response, couldNot) => {
    if (errored) {
      message.error(
        `Could not ${couldNot}. Check that the backend is running, reachable and returns valid JSON.`
      );
      return false;
    }
    if (response.message) {
      message.error(response.message);
      return false;
    }
    return true;
  };


  getAddresses = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (
        await fetch(`${config.endpoint}/user/addresses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      ).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response, "fetch addresses")) {
      if (response) {
        this.setState({
          addresses: response,
        });
      }
    }
  };


  addAddress = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (
        await fetch(`${config.endpoint}/user/addresses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: this.state.newAddress,
          }),
        })
      ).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response, "add a new address")) {
      if (response) {
        message.success("Address added");

        this.setState({
          newAddress: "",
        });

        await this.getAddresses();
      }
    }
  };


  deleteAddress = async (addressId) => {
    let response = {};
    let errored = false;
    this.setState({ loading: true });
    try {
      response = await fetch(`${config.endpoint}/user/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-type": "application/json",
        },
      }).then((resp) => resp.json());
    } catch (e) {
      errored = true;
    }
    this.setState({ loading: false });
    if (this.validateResponse(errored, response, "delete address")) {
      if (response) {
        message.info("Address deleted")
        this.setState((state, props) => {
          return { addresses: state.addresses.filter((e) => e._id !== addressId) }
        })
      }
    }
  };

  checkout = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (
        await fetch(`${config.endpoint}/cart/checkout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            addressId: this.state.addresses[this.state.selectedAddressIndex]
              ._id,
          }),
        })
      ).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response, "checkout")) {
      message.info("Order Successful");
      localStorage.setItem(
        "balance",
        this.state.balance - this.cartRef.current.calculateTotal()
      );
      this.props.history.push("/thanks");
    }
  };

  order = async () => {
    if (
      localStorage.getItem("balance") < this.cartRef.current.calculateTotal()
    ) {
      message.error("Your wallet balance is less please topup and try again");
    } else if (this.state.addresses.length === 0) {
      message.error(
        "Please enter the shipping address or select from the available addresses"
      );
    } else {
      await this.checkout();
    }
  };

  async componentDidMount() {
    if (localStorage.getItem("token") && localStorage.getItem("username")) {
      this.getProducts();
      this.getAddresses();
      this.setState({ balance: localStorage.getItem("balance") });
    }
  }

  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };

    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />

        {/* Display Checkout page content */}
        <div className="checkout-container">
          <Row>
            {/* Display checkout instructions */}
            <Col xs={{ span: 24, order: 2 }} md={{ span: 18, order: 1 }}>
              <div className="checkout-shipping">
                <h1 style={{ marginBottom: "-10px" }}>Shipping</h1>

                <hr></hr>
                <br></br>

                <p>
                  Manage all the shipping addresses you want (work place, home
                  address)<br></br>This way you won't have to enter the shipping
                  address manually with each order.
                </p>

                {/* Display the "Shipping" sectino */}
                <div className="address-section">
                  {this.state.addresses.length ? (
                    // Display the list of addresses as radio buttons
                    <Radio.Group
                      className="addresses"
                      defaultValue={this.state.selectedAddressIndex}
                      onChange={(e) => {
                        this.setState({
                          selectedAddressIndex: e.target.value,
                        });
                      }}
                    >
                      <Row>
                        {/* Create a view for each of the user's addresses */}
                        {this.state.addresses.map((address, index) => (
                          <Col xs={24} lg={12} key={address._id}>
                            <div className="address">
                              <Radio.Button value={index}>
                                <div className="address-box">
                                  {/* Display address title */}
                                  <div className="address-text">
                                    {address.address}
                                  </div>

                                  {/* Display button to delete address from user's list */}
                                  <Button type="primary" onClick={() => this.deleteAddress(address._id)}>Delete</Button>
                                </div>
                              </Radio.Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Radio.Group>
                  ) : (
                    // Display static text banner if no addresses are added
                    <div className="red-text checkout-row">
                      No addresses found. Please add one to proceed.
                    </div>
                  )}

                  <div className="checkout-row">
                    {/* Text input field to type a new address */}
                    <div>
                      <TextArea
                        className="new-address"
                        placeholder="Add new address"
                        rows={4}
                        value={this.state.newAddress}
                        onChange={(e) => {
                          this.setState({
                            newAddress: e.target.value,
                          });
                        }}
                      />
                    </div>

                    {/* Button to submit address added */}
                    <div>
                      <Button type="primary" onClick={this.addAddress}>
                        Add New Address
                      </Button>
                    </div>
                  </div>
                </div>

                <br></br>

                {/* Display the "Pricing" section */}
                <div>
                  <h1 style={{ marginBottom: "-10px" }}>Pricing</h1>

                  <hr></hr>

                  <h2>Payment Method</h2>

                  <Radio.Group value={1}>
                    <Radio style={radioStyle} value={1}>
                      Wallet
                      <strong> (₹{this.state.balance} available)</strong>
                    </Radio>
                  </Radio.Group>
                </div>

                <br></br>

                {/* Button to confirm order */}
                <Button
                  className="ant-btn-success"
                  loading={this.state.loading}
                  type="primary"
                  onClick={this.order}
                >
                  <strong>Place Order</strong>
                </Button>
              </div>
            </Col>

            {/* Display the cart */}
            <Col xs={{ span: 24, order: 1 }} md={{ span: 6, order: 2 }} className="checkout-cart">
              <div>
                {this.state.products.length && (
                  <Cart
                    ref={this.cartRef}
                    products={this.state.products}
                    history={this.props.history}
                    token={localStorage.getItem("token")}
                    checkout={true}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Checkout);

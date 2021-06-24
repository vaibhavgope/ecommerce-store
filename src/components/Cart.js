import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, message, Spin, InputNumber } from "antd";
import React from "react";
import { config } from "../App";
import "./Cart.css";


export default class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      loading: false,
    };
  }

  validateResponse = (errored, response) => {
    if (errored) {
      message.error(
        "Could not update cart. Check that the backend is running, reachable and returns valid JSON."
      );
      return false;
    }

    if (response.message) {
      message.error(response.message);
      return false;
    }

    return true;
  };

  getCart = async () => {
    let response = {};
    let errored = false;
    this.setState({
      loading: true,
    });
    try {
      response = await (
        await fetch(`${config.endpoint}/cart`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${this.props.token}`,
          },
        })
      ).json();
    } catch (e) {
      errored = true;
    }
    this.setState({
      loading: false,
    });
    if (this.validateResponse(errored, response)) {
      return response;
    }
  };

  pushToCart = async (productId, qty, fromAddToCartButton) => {
    if (fromAddToCartButton) {
      for (const item of this.state.items) {
        if (item.productId === productId) {
          message.error(
            "Item already added to cart. Use the cart sidebar to update quantity or remove item."
          );
          return;
        }
      }
    }

    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await (
        await fetch(`${config.endpoint}/cart`, {
          method: "POST",
          body: JSON.stringify({
            productId: productId,
            qty: qty,
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.props.token}`,
          },
        })
      ).json();
    } catch (e) {
      errored = true;
    }

    this.setState({
      loading: false,
    });

    if (this.validateResponse(errored, response)) {
      await this.refreshCart();
    }
  };

  refreshCart = async () => {
    const cart = await this.getCart();

    if (cart) {
      this.setState({
        items: cart.map((item) => ({
          ...item,
          product: this.props.products.find(
            (product) => product._id === item.productId
          ),
        })),
      });
    }
  };

  calculateTotal = () => {
    return this.state.items.length
      ? this.state.items.reduce(
        (total, item) => total + item.product.cost * item.qty,
        0
      )
      : 0;
  };

  getQuantityElement = (item) => {
    if (this.props.checkout) return <div className="cart-item-qty-fixed"></div>;
    else {
      let default_qty = this.state.items.find((i) => i.productId === item.productId)

      return <InputNumber min={1} max={10} defaultValue={default_qty.qty}
        onChange={(e) => {
          this.pushToCart(item.productId, e, false);
        }} />
    }
  };

  componentDidMount() {
    this.refreshCart();
  }
  render() {
    return (
      <div
        className={["cart", this.props.checkout ? "checkout" : ""].join(" ")}
      >
        {/* Display cart items or a text banner if cart is empty */}
        {this.state.items.length ? (
          <>
            {/* Display a card view for each product in the cart */}
            {this.state.items.map((item) => (
              <Card className="cart-item" key={item.productId}>
                {/* Display product image */}
                <img
                  className="cart-item-image"
                  alt={item.product.name}
                  src={item.product.image}
                />

                {/* Display product details*/}
                <div className="cart-parent">
                  {/* Display product name, category and total cost */}
                  <div className="cart-item-info">
                    <div>
                      <div className="cart-item-name">{item.product.name}</div>

                      <div className="cart-item-category">
                        {item.product.category}
                      </div>
                      {this.props.checkout && <div className="cart-item-qty">Qty: {item.qty}</div>}
                    </div>

                    <div className="cart-item-cost">
                      ₹{item.product.cost * item.qty}
                    </div>
                  </div>

                  {/* Display field to update quantity or a static quantity text */}
                  <div className="cart-item-qty">
                    {this.getQuantityElement(item)}
                  </div>
                </div>
              </Card>
            ))}

            {/* Display cart summary */}
            <div className="total">
              <h2>Total</h2>

              {/* Display net quantity of items in the cart */}
              <div className="total-item">
                <div>Products</div>
                <div>
                  {this.state.items.reduce(function (sum, item) {
                    return sum + item.qty;
                  }, 0)}
                </div>
              </div>

              {/* Display the total cost of items in the cart */}
              <div className="total-item">
                <div>Sub Total</div>
                <div>₹{this.calculateTotal()}</div>
              </div>

              {/* Display shipping cost */}
              <div className="total-item">
                <div>Shipping</div>
                <div>N/A</div>
              </div>
              <hr></hr>

              {/* Display the sum user has to pay while checking out */}
              <div className="total-item">
                <div>Total</div>
                <div>₹{this.calculateTotal()}</div>
              </div>
            </div>
          </>
        ) : (
          // Display a static text banner if cart is empty
          <div className="loading-text">
            Add an item to cart and it will show up here
            <br />
            <br />
          </div>
        )}

        {/* Display a "Checkout" button */}
        <Button type="primary" size="large"
          icon={<ShoppingCartOutlined />}
          className="checkout-btn"
          onClick={(e) => {
            if (this.state.items.length === 0) {
              this.props.history.push('/checkout')
              message.error("You must add items to cart first");
            }
            else this.props.history.push('/checkout');
          }}
        >
          Checkout
        </Button>
        {/* Display a loading icon if the "loading" state variable is true */}
        {this.state.loading && (
          <div className="loading-overlay">
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  }
}

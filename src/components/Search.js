import { Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Cart from "./Cart";
import Header from "./Header/Header";
import Product from "./Product";
import { Row, Col } from "antd";
import Footer from "./Footer";
import "./Search.css";
import makeApiCall from "./utils/makeApiCall";

class Search extends React.Component {
  constructor() {
    super();
    this.cartRef = React.createRef();
    this.debounceTimeout = 0;
    this.products = [];
    this.state = {
      loading: false,
      loggedIn: false,
      filteredProducts: [],
    };
  }


  validateResponse = (errored, response) => {
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


  performAPICall = async () => {
    let response = {};
    let errored = false;

    this.setState({
      loading: true,
    });

    try {
      response = await makeApiCall(`${config.endpoint}/products`)
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


  getProducts = async () => {
    let data = await this.performAPICall();
    if (data) {
      this.products = data;

      this.setState({ filteredProducts: [...this.products] });
    }
  };


  componentDidMount() {
    this.getProducts();
    if (localStorage.getItem("token") !== null) {
      this.setState({ loggedIn: true });
    } else this.setState({ loggedIn: false });
  }


  search = (text) => {
    this.setState((state, props) => ({
      filteredProducts: this.products.filter((ele) => ele.name.toLowerCase().includes(text.toLowerCase()) || ele.category.toLowerCase().includes(text.toLowerCase()))
    }));
  };


  debounceSearch = (event) => {
    let searchText = event.target.value;
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(
      function () {
        this.search(searchText);
      }.bind(this),
      300
    );
  };

  getProductElement = (product) => {
    return (
      <Col xs={24} sm={12} xl={6} key={product._id}>
        <Product
          product={product}
          addToCart={() => {
            if (this.state.loggedIn) {
              message.info("Adding to cart");
              this.cartRef.current.pushToCart(product._id, 1, true);
              console.log(this.cartRef.current);

            } else this.props.history.push("/login");
          }}
        />
      </Col>
    );
  };


  render() {
    return (
      <>
        {/* Display Header with Search bar */}
        <Header history={this.props.history} token={localStorage.getItem("token")}>
          <Input.Search
            placeholder="Search"
            onSearch={this.search}
            style={{ width: 600 }}
            onChange={this.debounceSearch}
            enterButton={true}
          />
        </Header>
        {/* Use Antd Row/Col components to display products and cart as columns in the same row*/}
        <Row>
          {/* Display products */}
          <Col xs={{ span: 24 }} md={{ span: 18 }}>
            <div className="search-container ">
              {/* Display each product item wrapped in a Col component */}
              <Row>
                {this.products.length !== 0 ? (
                  this.state.filteredProducts.map((product) =>
                    this.getProductElement(product)
                  )
                ) : this.state.loading ? (
                  <div className="loading-text">Loading products...</div>
                ) : (
                  <div className="loading-text">No products to list</div>
                )}
              </Row>
            </div>
          </Col>

          {this.state.loggedIn && this.products.length && (
            <Col
              xs={{ span: 24 }} md={{ span: 6 }} sm={12} xl={6}
              className="search-cart"
            >
              <div>
                <Cart history={this.props.history} ref={this.cartRef}
                  token={localStorage.getItem("token")}
                  products={this.products}
                />
              </div>
            </Col>
          )}
        </Row>

        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}

export default withRouter(Search);

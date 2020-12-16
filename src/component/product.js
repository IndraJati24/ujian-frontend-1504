import React from "react";
import Axios from "axios";
import { Card, Button, Modal, Table, Toast } from "react-bootstrap";
import { connect } from "react-redux";
import { login } from "../action";

class Products extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      cart: [],
      buyNow: false,
      selectedId: null,
      amount: 1,
      stock: 1,
      toast: false,
      errLogin: false,
    };
  }

  componentDidMount = () => {
    Axios.get("http://localhost:2000/products")
      .then((res) => {
        this.setState({ data: res.data });
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  handleBuy = (index) => {
    this.setState({ selectedId: index });
    console.log(this);
    console.log(this.state.selectedId);

    this.setState({ buyNow: true });
  };

  buy = (id) => {
    if (!this.props.email) return alert("Belum Login");

    let dataCart = {
      id: "",
      name: "",
      image: "",
      price: "",
      stock: "",
      qty: this.state.amount,
    };

    this.state.data.map((item, index) => {
      if (item.id === id) {
        dataCart.id = item.id;
        dataCart.name = item.name;
        dataCart.image = item.img;
        dataCart.price = item.price * this.state.amount;
        dataCart.stock = item.stock;
      }
    });

    let tempCart = this.props.cart;

    let even = (e) => e.name === dataCart.name;

    if (tempCart.some(even) === true) {
      tempCart.forEach((item) => {
        if (item.name === dataCart.name) {
          item.qty += dataCart.qty;
          item.price = item.qty * item.price;
        }
      });
    } else {
      tempCart.push(dataCart);
    }

    Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
      cart: tempCart,
    })
      .then((res) => {
        console.log(res.data);
        this.props.login(res.data);
        this.setState({ buyNow: false, toast: true });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { buyNow, cart, data } = this.state;
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {this.state.data.map((item, index) => {
            return (
              <Card
                key={index}
                style={{
                  width: "18rem",
                  marginBottom: "20px",
                  display: "flex",
                  flexDiretion: "column",
                }}
              >
                <Card.Img variant="top" src={item.img} />
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>
                    Rp. {item.price.toLocaleString()}.00 Stock : {item.stock}
                  </Card.Text>
                  <div
                    style={{ display: "flex", justifyContent: "space-evenly" }}
                  >
                    <Button>List</Button>
                    <Button onClick={() => this.handleBuy(index)}>
                      Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        <Modal show={buyNow} onHide={() => this.setState({ buyNow: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.data.map((item, index) => {
              if (this.state.selectedId === index) {
                return (
                  <div key={index}>
                    <div>
                      <img
                        src={item.img}
                        alt={item.name}
                        style={{ height: 50 }}
                      />
                    </div>
                    <div>
                      Name : {item.name}, Stock: {item.stock}
                      <div>
                        <Button
                          disabled={this.state.amount <= 1 ? true : false}
                          onClick={() =>
                            this.setState({ amount: this.state.amount - 1 })
                          }
                        >
                          -
                        </Button>
                        <h5>{this.state.amount}</h5>
                        <Button
                          disabled={
                            this.state.amount >= item.stock ? true : false
                          }
                          onClick={() =>
                            this.setState({ amount: this.state.amount + 1 })
                          }
                        >
                          +
                        </Button>
                      </div>
                      <div>
                        <Button onClick={() => this.buy(item.id)}>Buy</Button>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </Modal.Body>
          <Modal.Footer>
            {/* <Button
              variant="primary"
              onClick={() => this.setState({ buyNow: false })}
            >
              Close
            </Button> */}
          </Modal.Footer>
        </Modal>
        <Toast
          show={this.state.toast}
          onClose={() => this.setState({ toast: false })}
          delay={1500}
          autohide
        >
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Hai</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Sepatu kamu sudah masuk keranjang</Toast.Body>
        </Toast>
        <Modal
          show={this.state.errLogin}
          onHide={() => this.setState({ errLogin: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.setState({ errLogin: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.user.cart,
    id: state.user.id,
    email: state.user.email,
  };
};
export default connect(mapStateToProps, { login })(Products);

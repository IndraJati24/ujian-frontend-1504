import React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { login } from "../action";

class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: null,
      amount: null,
      confirm: false,
      errorStock: false,
    };
  }
  tbody = () => {
    return this.props.cart.map((item, index) => {
      if (this.state.selectedIndex === index) {
        return (
          <tr key={index}>
            <td>{item.name}</td>
            <td>
              <img src={item.image} alt={item.name} style={{ height: 50 }} />
            </td>
            <td>
              <Button
                disabled={this.state.amount <= 1 ? true : false}
                onClick={() => this.setState({ amount: this.state.amount - 1 })}
              >
                -
              </Button>
              <Form.Control
                placeholder="Enter Quantity"
                ref="editQty"
                value={this.state.amount}
              />
              <Button
                onClick={() =>
                  this.setState({
                    amount: this.state.amount + 1,
                    errorStock: this.state.amount >= item.stock ? true : false,
                  })
                }
                disabled={this.state.amount > item.stock ? true : false}
              >
                +
              </Button>
            </td>
            <td>{item.price.toLocaleString()}</td>
            <td>
              <Button onClick={() => this.handleSave(index)}>Save</Button>
              <Button onClick={() => this.setState({ selectedIndex: null })}>
                Cancel
              </Button>
            </td>
          </tr>
        );
      }
      return (
        <tr key={index}>
          <td>{item.name}</td>
          <td>
            <img src={item.image} alt={item.name} style={{ height: 50 }} />
          </td>
          <td>{item.qty}</td>
          <td>{item.price.toLocaleString()}</td>
          <td>
            <Button onClick={() => this.handleEdit(index)}>Edit</Button>
            <Button onClick={() => this.handleDelete(index)}>Delete</Button>
          </td>
        </tr>
      );
    });
  };

  handleDelete = (index) => {
    let tempCart = [...this.props.cart];
    tempCart.splice(index, 1);

    Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
      cart: tempCart,
    })
      .then((res) => {
        console.log(res.data);
        this.props.login(res.data);
      })
      .catch((err) => console.log(err));
  };

  handleEdit = (index) => {
    this.setState({ selectedIndex: index, amount: this.props.cart[index].qty });
  };

  handleSave = (index) => {
    let qty = this.refs.editQty.value;
    let tempCart = [...this.props.cart];
    console.log(qty)

    tempCart[index].qty = parseInt(qty);
    tempCart[index].price = qty * tempCart[index].price;

    Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
      cart: tempCart,
    })
      .then((res) => {
        console.log(res.data);
        this.props.login(res.data);
        this.setState({ selectedIndex: null });
      })
      .catch((err) => console.log(err));
  };

  handleCheck = () => {
    this.setState({ confirm: true });
  };
  handleClose = () => {
    let history = {
      email: this.props.email,
      name: this.props.cart[0].name,
      product: this.props.cart,
      status: "Belum di bayar",
    };

    Axios.post("http://localhost:2000/history", history).then((res) => {
      console.log(res.data);
      Axios.patch(`http://localhost:2000/users/${this.props.id}`, {
        cart: [],
      }).then((res) => {
        console.log(res.data);
        this.props.login(res.data);
        this.setState({ confirm: false });
      });
    });
  };

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.handleCheck}>Checkout</Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.tbody()}</tbody>
        </Table>
        <Modal
          show={this.state.confirm}
          onHide={() => this.setState({ confirm: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Hai</Modal.Title>
          </Modal.Header>
          <Modal.Body>Apakah sudah yakin untuk membeli?</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClose}>
              Oke
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.errorStock}
          onHide={() => this.setState({ errorStock: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Melebihi stock</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.setState({ errorStock: false })}
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
export default connect(mapStateToProps, { login })(CartPage);

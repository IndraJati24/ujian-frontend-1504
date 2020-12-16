import React from "react";
import { Navbar, Nav, Image, Dropdown, Button, Badge } from "react-bootstrap";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import{logout} from "../action"

class Navigation extends React.Component {
  handleLogout = () => {
    this.props.logout();
    localStorage.removeItem("email");
  };
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          Toko Sepatu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto"></Nav>
          <Button variant="primary" as={Link} to="./cart">
            Cart <Badge variant="light">{this.props.cart.length}</Badge>
            <span className="sr-only">unread messages</span>
          </Button>
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              style={{
                width: "160px",
                border: "1px solid transparent",
              }}
            >
              {this.props.email ? this.props.email : "Username"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {this.props.email ? (
                <>
                  <Dropdown.Item
                    onClick={this.handleLogout}
                    as={Link}
                    to="/login"
                  >
                    Logout
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/history">
                    History
                  </Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/login">
                    Login
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.user.email,
    cart: state.user.cart,
  };
};

export default connect(mapStateToProps,{logout})(Navigation);

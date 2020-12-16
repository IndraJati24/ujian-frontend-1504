import React from "react";
import Axios from "axios";
import { FormControl, Button } from "react-bootstrap";
import{login} from "../action"
import{connect} from "react-redux"
import {Redirect} from "react-router-dom"

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValidErr: [false, ""],
    };
  }

  handleLogin = () => {
    const { emailValidErr } = this.state;
    let email = this.refs.email.value;
    let password = this.refs.password.value;

    if (!email || !password) return alert("gak boleh kosong");

    let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(email))
      return this.setState({ emailValidErr: [true, "*Email not valid"] });

    let numb = /[0-9]/;
    // let upper = /[A-Z]/;

    if (!numb.test(password) || password.length < 6)
      return this.setState({
        emailValidErr: [true, "*Must include number, min 6 char"],
      });

    Axios.get(`http://localhost:2000/users?email=${email}`).then((res) => {
      console.log(res.data);
      this.props.login(res.data[0])
      localStorage.email = email;
      if (res.data.length === 0) {
        Axios.post("http://localhost:2000/users", {
          email: email,
          password: password,
          cart:[]
        })
          .then((res) => {
            console.log(res.data);
            this.props.login(res.data[0])
          })
          .catch((err) => console.log(err));
      }
    });
  };
  render() {
    if (this.props.email) return <Redirect to="/" />;
    const { emailValidErr } = this.state;
    return (
      <div>
        <div>
          <h1>Login Form</h1>
          <FormControl
            placeholder="Email"
            aria-label="email"
            ref="email"
            aria-describedby="basic-addon1"
          />
          <FormControl
            placeholder="Password"
            aria-label="password"
            ref="password"
            aria-describedby="basic-addon1"
          />
          {emailValidErr[1]}
          <div>
            <Button onClick={this.handleLogin}>Login</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      email: state.user.email,
    };
  };

export default connect(mapStateToProps, {login})(Login);

import React from "react";
import Axios from "axios";
import { connect } from "react-redux";
import { Table, Button } from "react-bootstrap";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }
  componentDidMount() {
    Axios.get("http://localhost:2000/history")
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data });
      })
      .catch((err) => console.log(err));
  }
  tbody = () => {
    return this.state.data.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.email}</td>
          <td>
            {item.product.map((item) => {
              return (
                  <tr>{item.name}</tr>
                  ) 
            })}
          </td>
          <td>{item.status}</td>
          <td>
            <Button onClick={() => this.handleCancel(index)}>Cancel</Button>
          </td>
        </tr>
      );
    });
  };

  handleCancel = (index) => {
    Axios.delete(`http://localhost:2000/history/${this.state.data[index].id}`)
      .then((res) => {
        console.log(res.data);
        Axios.get("http://localhost:2000/history")
          .then((res) => {
            console.log(res.data);
            this.setState({ data: res.data });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Nama product</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{this.tbody()}</tbody>
        </Table>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    email: state.user.email,
  };
};
export default connect(mapStateToProps)(History);

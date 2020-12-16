import React from "react";


import Products from "../component/product"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Products />
      </div>
    );
  }
}

export default Home;

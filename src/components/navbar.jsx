import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <div className="dashBoardDiv">
        <div style={{ paddingLeft: 30, paddingTop: 4 }}>
          <img
            style={{ paddingRight: 20 }}
            src="../images/BITS_Pilani-Goa-Logo.png"
          />

          <label className="dashBoardLabel">Air Condition Dashboard</label>
        </div>

        <img
          style={{
            height: 4,
            width: 470,
            position: "relative",
            bottom: 6,
            left: 805,
          }}
          src="../images/bits-line.gif"
        />
      </div>
    );
  }
}

export default NavBar;

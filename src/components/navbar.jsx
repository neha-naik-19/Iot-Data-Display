import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";

class NavBar extends Component {
  render() {
    return (
      <div className="dashBoardDiv dashBoardNavHeight">
        <div style={{ paddingLeft: 30, paddingTop: 4 }}>
          <img
            style={{ paddingRight: 20 }}
            src="../images/BITS_Pilani-Goa-Logo.png"
          />

          <label className="dashBoardLabel">Air Condition Dashboard</label>
        </div>

        <img
          className="line"
          style={{
            height: "4px",
            width: "470px",
            position: "absolute",
            left: "auto",
            right: 0,
            paddingRight: "6px",
          }}
          src="../images/bits-line.gif"
        />
      </div>
    );
  }
}

export default NavBar;

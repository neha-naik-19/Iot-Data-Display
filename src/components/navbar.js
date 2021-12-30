import React, { Component } from "react";

import { NavLink } from "react-router-dom";

// import Chart from "./chart";

class NavBar extends Component {
  render() {
    return (
      <ul
        className="navbar-nav bg-gradient-info sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        <div
          className="sidebar-brand d-flex align-items-center text-left"
          // href="index.html"
        >
          <div className="sidebar-brand-icon rotate-n-0">
            <i>
              <img src={process.env.PUBLIC_URL + "/BITS_Pilani-Goa-Logo.png"} />
            </i>
          </div>
          <div className="sidebar-brand-text mx-2">Air Condition Dashboard</div>
        </div>

        <hr className="sidebar-divider my-0"></hr>

        <li className="nav-item active">
          <NavLink className="nav-link" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <hr className="sidebar-divider"></hr>

        <div className="sidebar-heading">Calendar</div>

        <li className="nav-item">
          <a
            className="btn nav-link"
            onClick={() => this.props.calType("Monthly")}
          >
            <i className="fas fa-fw fa-calendar"></i>
            <span id="spnMonthly">Monthly</span>
          </a>
        </li>

        <li className="nav-item">
          <a
            className="btn nav-link"
            onClick={() => this.props.calType("Weekly")}
          >
            <i className="fas fa-fw fa-calendar-week"></i>
            <span>Weekly</span>
          </a>
        </li>

        <hr className="sidebar-divider"></hr>

        <div className="sidebar-heading">Addons</div>

        <li className="nav-item">
          <NavLink
            className="nav-link"
            // activeStyle={{ color: "red" }}
            to="/chart"
          >
            <i className="far fa-chart-bar"></i>
            <span>Charts</span>
          </NavLink>
        </li>

        <hr className="sidebar-divider d-none d-md-block"></hr>

        {/* <div className="text-center d-none d-md-inline">
          <button
            className="rounded-circle border-0"
            id="sidebarToggle"
          ></button>
        </div> */}

        <div className="sidebar-card d-none d-lg-flex">
          <button
            className="btn btn-success btn-md"
            onClick={(e) => {
              this.props.refreshPage(e);
            }}
          >
            <i className="fas fa-redo"></i>
            <span> Refresh</span>
          </button>
        </div>
      </ul>
    );
  }
}

export default NavBar;

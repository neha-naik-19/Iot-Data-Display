import React, { Component } from "react";
import Select from "react-select";

class selectAc extends Component {
  state = { acData: [] };

  render() {
    let { acData } = this.state;
    let acOptions = [];

    if (!this.props.isLoading) {
      acOptions = [
        { value: "01", label: "D250AC01", disabled: false },
        { value: "02", label: "D250AC02", disabled: false },
        { value: "03", label: "D250AC03", disabled: false },
        { value: "04", label: "D250AC04", disabled: false },
      ];
    } else {
      acOptions = [
        { value: "01", label: "D250AC01", disabled: true },
        { value: "02", label: "D250AC02", disabled: true },
        { value: "03", label: "D250AC03", disabled: true },
        { value: "04", label: "D250AC04", disabled: true },
      ];
    }

    const colourStyles = {
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        if (isSelected) {
          acData = { data, isSelected };
        }
        return {
          ...styles,
          backgroundColor: isFocused ? "#999999" : null,
          color: "#333333",
        };
      },
      control: (base, state) => ({
        ...base,
        background: "#B0C4DE",
        borderColor: "#B0C4DE",
        boxShadow: "2px 2px 2.5px #888888",
      }),
      menuList: (base) => ({
        ...base,
        padding: 0,
      }),
    };

    return (
      <Select
        defaultValue={acOptions[0]}
        label="Single select"
        options={acOptions}
        styles={colourStyles}
        onChange={this.props.selectAc}
        isOptionDisabled={(option) => option.disabled}
        // autoFocus
      />
    );
  }
}

export default selectAc;

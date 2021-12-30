import React, { Component } from "react";
import Select from "react-select";

class selectAc extends Component {
  state = { acData: [] };

  render() {
    let { acData } = this.state;
    let tempOptions = [];

    if (!this.props.isLoading) {
      tempOptions = [
        { value: "01", label: "Room Temp.", disabled: false },
        { value: "02", label: "Unit Consumption", disabled: false },
        { value: "03", label: "Humidity", disabled: false },
      ];
    } else {
      // tempOptions = [{ value: "01", label: "Room Temp." }];
      tempOptions = [
        { value: "01", label: "Room Temp.", disabled: true },
        { value: "02", label: "Unit Consumption", disabled: true },
        { value: "03", label: "Humidity", disabled: true },
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
        defaultValue={tempOptions[0]}
        label="Single select"
        options={tempOptions}
        styles={colourStyles}
        onChange={this.props.selectTemp}
        isOptionDisabled={(option) => option.disabled}
      />
    );
  }
}

export default selectAc;

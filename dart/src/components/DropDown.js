import React, { useState, useEffect } from 'react'

// Dropdown component to populate the options dynamically and update the state variable
const DropDown = ({ options }) => {
  let optionItems = options.map((option) =>
    <option key={ option.name }>{ option.name }</option>
  );
  return (
    <div class="input-group mb-3">
    <div class="input-group-prepend">
      <label class="input-group-text" for="inputModels">Available Models</label>
    </div>
    <select class="custom-select" id="inputModelName" {...bindModelName}>
      {optionItems}   
    </select>
  </div>
  );
}

export default DropDown
import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
const SelectListGroup = ({ name, value, options, info, error, onChange }) => {
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="form-group">
      <select
        name={name}
        className={classnames("form-control form-control-lg", {
          "is-invalid": error
        })}
        onChange={onChange}
        value={value}
      >
        {selectOptions}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRquired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SelectListGroup;

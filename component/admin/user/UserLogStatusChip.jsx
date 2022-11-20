import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const UserLogStatusChip = (props) => {
    const { value } = props;
    return (
        <Chip
        label={value.text}
        color={value.code == "1"? "info": value.code == "2"? "success": value.code == "3"? "error": "primary"}
      />
    );
  };
  
  UserLogStatusChip.propTypes = {
    /**
     * If true, the cell is the active element.
     */
    hasFocus: false,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.instanceOf(String),
  };

export default UserLogStatusChip;
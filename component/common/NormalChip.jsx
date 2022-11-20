import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const NormalChip = (props) => {
    const { value } = props;
  
    return (
        <Chip
        label={value}
        color='info'
      />
    );
  };
  
  NormalChip.propTypes = {
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

export default NormalChip;
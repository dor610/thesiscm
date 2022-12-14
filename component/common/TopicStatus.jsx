
import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const TopicStatus = (props) => {
    const { status, statusCode } = props.row;
    return (
        <Chip label={status} color={statusCode == "1"? "success": statusCode == "2"? "primary": statusCode == "3"? "error":"warning"}/>
    );
  };
  
  TopicStatus.propTypes = {
    /**
     * If true, the cell is the active element.
     */
    hasFocus: false,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.instanceOf(Object),
  };

export default TopicStatus;
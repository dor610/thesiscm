
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const ThesisCommitteeMember = (props) => {
    const { president, secretary, member } = props.row;

    return (
      <ol>
        <li>{president.title + ". " + president.name}</li>
        <li>{secretary.title + ". " + secretary.name}</li>
        <li>{member.title + ". " + member.name}</li>
      </ol>
    );
  };
  
  ThesisCommitteeMember.propTypes = {
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

export default ThesisCommitteeMember;
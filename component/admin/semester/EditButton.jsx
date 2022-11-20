import { Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setSemesterEditId, setSemesterOnEdit } from "../../../features/semesterSlice";

const EditButton = (props) => {
    const { hasFocus, value } = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);
    const dispatch = useDispatch();

    React.useLayoutEffect(() => {
      if (hasFocus) {
        const input = buttonElement.current?.querySelector('input');
        input?.focus();
      } else if (rippleRef.current) {
        // Only available in @mui/material v5.4.1 or later
        rippleRef.current.stop({});
      }
    }, [hasFocus]);

    const onClick = () =>{
      dispatch(setSemesterOnEdit(true));
      dispatch(setSemesterEditId(value));
    }
  
    return (
      <Button 
          startIcon={<Edit />}
          component="button"
          ref={buttonElement}
          touchRippleRef={rippleRef}
          variant="contained"
          size="small"
          onClick={() => { onClick() }}
          color='primary'
          style={{ marginLeft: 16 }}
          // Remove button from tab sequence when cell does not have focus
          tabIndex={hasFocus ? 0 : -1}
          onKeyDown={(event) => {
            if (event.key === ' ') {
              // Prevent key navigation when focus is on button
              event.stopPropagation();
            }
          }}
        >
          Chỉnh sửa
        </Button>
    );
  };
  
  EditButton.propTypes = {
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

export default EditButton;
import { Check } from '@mui/icons-material';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const EnableButon = (props) => {
    const { hasFocus, value } = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);
  
    
    const aaa = () =>{
        console.log("asdasdas");
        errorNotify("hioih", 1)
      }

    React.useLayoutEffect(() => {
      if (hasFocus) {
        const input = buttonElement.current?.querySelector('input');
        input?.focus();
      } else if (rippleRef.current) {
        // Only available in @mui/material v5.4.1 or later
        rippleRef.current.stop({});
      }
    }, [hasFocus]);
  
    return (
        <Button
        startIcon={<Check />}
        component="button"
        ref={buttonElement}
        touchRippleRef={rippleRef}
        variant="contained"
        size="small"
        color='primary'
        onClick={(e) => {aaa()}}
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
        Kích hoạt
      </Button>
    );
  };
  
  EnableButon.propTypes = {
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

export default EnableButon;
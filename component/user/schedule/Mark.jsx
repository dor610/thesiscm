import { Info } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

const Mark = (props) => {
    const { hasFocus, value } = props;
    const buttonElement = React.useRef(null);
    const rippleRef = React.useRef(null);
    const router = useRouter();

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
      router.push(`/presentation/${value}`);
    }

    return (
      <Button 
          startIcon={<Info />}
          component="button"
          ref={buttonElement}
          touchRippleRef={rippleRef}
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          onClick={() => {onClick()}}
          // Remove button from tab sequence when cell does not have focus
          tabIndex={hasFocus ? 0 : -1}
          onKeyDown={(event) => {
            if (event.key === ' ') {
              // Prevent key navigation when focus is on button
              event.stopPropagation();
            }
          }}
        >
          Báo cáo 
        </Button>
    );
  };
  
  Mark.propTypes = {
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

export default Mark;
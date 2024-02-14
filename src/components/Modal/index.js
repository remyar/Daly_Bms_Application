import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    //border: '2px solid #000',
    borderRadius: '4px',
    boxShadow: 24,
    p: 4,
};

function Modal(props) {

    let _style = { ...style };

    if (props.sx) {
        _style = { ...style, ...props.sx };
    }

    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.display}
        onClick={() => { props.onClose && props.onClose(); }}
    >
        <Box sx={_style}>
            {props.children}
        </Box>
    </Backdrop>
}

export default Modal;
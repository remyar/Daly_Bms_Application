import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import actions from '../../actions';

function HomePage(props) {

    return <Box>

        {/*<Loader display={displayLoader} />*/}

        <Box sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: "80%",
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        }}>

            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ textAlign: 'center' }} />
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }} />
            </Grid>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ textAlign: 'center' }} />
                <Grid item xs={6} sx={{ textAlign: 'center' }}>

                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }} />
            </Grid>
        </Box>
    </Box >

}

export default withStoreProvider(withSnackBar(withNavigation(injectIntl(HomePage))));
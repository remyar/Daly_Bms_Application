import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from './providers/StoreProvider';
import { withSnackBar } from './providers/snackBar';
import routeMdw from './middleware/route';

import HomePage from './pages/home';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import electron from 'electron';

const routes = [
    { path: routeMdw.urlIndex(), name: 'HomePage', Component: <HomePage /> },
    { path: routeMdw.urlHome(), name: 'HomePage', Component: <HomePage /> },
];

function App(props) {

    const intl = props.intl;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [drawerState, setDrawerState] = useState(false);

    useEffect(() => {
        electron.ipcRenderer.on('update-available', (event, message) => {
            props.snackbar.warning(intl.formatMessage({ id: 'update.available' }));
        });

        electron.ipcRenderer.on('download-progress', (event, message) => {
            props.snackbar.info(intl.formatMessage({ id: 'update.download' }) + ' : ' + parseInt(message?.percent || "0.0") + "%");
        });

        electron.ipcRenderer.on('update-downloaded', (event, message) => {
            props.snackbar.info(intl.formatMessage({ id: 'update.downloaded' }));
        });

        electron.ipcRenderer.on('update-quitForApply', (event, message) => {
            props.snackbar.success(intl.formatMessage({ id: 'update.apply' }));
        });

        electron.ipcRenderer.on('update-error', (event, message) => {
            props.snackbar.error(intl.formatMessage({ id: 'update.error' }));
        });
    }, []);


    return <Box >
        <AppBar onClick={() => { setDrawerState(true) }} title={(selectedVehicule?.plate && selectedVehicule?.designation) ? selectedVehicule?.plate + " : " + selectedVehicule?.designation : undefined} />
        <Box sx={{ paddingTop: '64px' }} >
            <Container maxWidth="xl" sx={{ paddingTop: "25px" }} >
                <Drawer
                    open={drawerState}
                    onClose={() => { setDrawerState(false) }}
                />
                <Routes >
                    {routes.map(({ path, Component }) => (
                        <Route path={path} key={path} element={Component} />
                    ))}
                </Routes>
            </Container>
        </Box>
    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(App)));

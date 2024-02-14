import React, { useEffect, useState, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Switch from '@mui/material/Switch';

import actions from '../../actions';



function SettingsPage(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const [serialPortsList, setSerialportsList] = useState([{ path : props.globalState.settings.serialPort}]);

    async function _getSerialPortslist() {
        try {
            let ports = (await props.dispatch(actions.serial.getSerialPortsList()))?.serialPorts;
            setSerialportsList(ports);
        } catch (err) {
            setSerialportsList([]);
        }
    }

    useEffect(() => {
        _getSerialPortslist();
    }, []);

    return <Box>
        <List>
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.adminMode' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Ouvrir la console" />
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={props.globalState?.settings?.serialPort}
                    defaultValue={props.globalState?.settings?.serialPort}
                    onChange={async (event)=>{
                        await props.dispatch(actions.set.saveSettings({ serialPort: event.target.value}));
                        await props.dispatch()
                    }}
                >
                    {serialPortsList.map((serialPort)=>{
                        return <MenuItem value={serialPort.path}>{serialPort.path}</MenuItem>
                    })}
                </Select>
            </ListItem>
        </List>
        <List>
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.adminMode' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Ouvrir la console" />
                <Switch
                    checked={globalState.debugConsole}
                    onChange={async (event) => {
                        props.dispatch(actions.debug.toggleConsole(event.target.checked));
                    }} />
            </ListItem>
        </List>
    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(SettingsPage)));
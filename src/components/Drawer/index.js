import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MemoryIcon from '@mui/icons-material/Memory';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCardIcon from '@mui/icons-material/AddCard';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import ConstructionIcon from '@mui/icons-material/Construction';

import routeMdw from '../../middleware/route';

function MyDrawer(props) {
    const intl = props.intl;

    const globalState = props.globalState;

    return <Drawer open={props.open} onClose={() => { props.onClose && props.onClose() }}>
        <List>

            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlHome());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.index' })} secondary={intl.formatMessage({ id: 'url.index.desc' })} />
            </ListItem>

            {/*
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlClients());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <PeopleAltIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.clients' })} secondary={intl.formatMessage({ id: 'url.clients.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlVehicules());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.vehicules' })} secondary={intl.formatMessage({ id: 'url.vehicules.desc' })} />
            </ListItem>
            {globalState.settings?.useCatalog && <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlCatalog());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.catalog' })} secondary={intl.formatMessage({ id: 'url.catalog.desc' })} />
            </ListItem>}

            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlProduits());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.produits' })} secondary={intl.formatMessage({ id: 'url.produits.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlServices());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <InventoryIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.services' })} secondary={intl.formatMessage({ id: 'url.services.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlDevis());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <AddCardIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.devis' })} secondary={intl.formatMessage({ id: 'url.devis.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlBillings());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <AddCardIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.billings' })} secondary={intl.formatMessage({ id: 'url.billings.desc' })} />
            </ListItem>
        */}
        </List>
        <List sx={{ position: "absolute", bottom: "0px", width: "100%" }}>
{/*
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlTechnics());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <ConstructionIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.technics' })} secondary={intl.formatMessage({ id: 'url.technics.desc' })} />
            </ListItem>
        */}
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlSettings());
                props.onClose && props.onClose();
            }} >
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'url.settings' })} secondary={intl.formatMessage({ id: 'url.settings.desc' })} />
            </ListItem>
        </List>
    </Drawer>;
}


export default withStoreProvider(withNavigation(injectIntl(MyDrawer)));
import React, { useEffect, useState, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import InputMask from 'react-input-mask';
import { validate, v4 } from 'uuid';
import QRCode from 'qrcode';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import Switch from '@mui/material/Switch';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import actions from '../../actions';
import Loader from '../../components/Loader';
import ChangeUUIDModal from '../../components/ChangeUUIDModal';

import AmBrandsSelectorForInstallationModal from '../../components/AmBrandsSelectorForInstallationModal';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import { Buffer } from 'buffer';
import Installation from '../../components/Installation';
import database from '../../actions/database';

import PasswordAsk from '../../components/PasswordAsk';

const ValidationSchema = Yup.object().shape({
    nom: Yup.string().required(),
    adresse1: Yup.string().required(),
    adresse2: Yup.string(),
    code_postal: Yup.string().required(),
    ville: Yup.string().required(),
    email: Yup.string().email(),
    siret: Yup.string().required(),
    telephone: Yup.string().required(),
    rcs: Yup.string().required(),
});

const ValidationSchemaPaiement = Yup.object().shape({
    nom: Yup.string().required(),
    iban: Yup.string().required(),
    order: Yup.string().required(),
});

function SettingsPage(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const inputRef = useRef(null);

    const [displayChangeUUIDModal, setDisplayChangeUUIDModal] = useState(false);
    const [displayLoader, setDisplayLoader] = useState(false);
    const [displayAmBrandsSelector, setDisplayAmBrandsSelector] = useState(false);
    const [displayDatabaseInstaller, setDisplayDatabaseInstaller] = useState(false);
    const [uuidImg, setUuidImg] = useState("");

    const [displayPasswordAskForDebug, setDisplayPasswordAskForDebug] = useState(false);
    const [displayPasswordAskForGodMode , setDisplayPasswordAskForGodMode] = useState(false);

    async function UUID() {
        if (globalState?.settings?.uuid == undefined) {
            await props.dispatch(actions.set.saveSettings({ uuid: v4() }));
        }
        setUuidImg(await QRCode.toDataURL(globalState?.settings?.uuid));
    }

    useEffect(() => {
        UUID();
    }, []);

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
            return;
        }

        const reader = new FileReader();

        reader.onload = async function (e) {
            const text = e.target.result;
            await props.dispatch(actions.set.saveEntrepriseLogo(e.target.result));
            setDisplayLoader(false);
        };

        reader.onerror = (err) => {
            console.error(err);
        }

        reader.readAsDataURL(fileObj);
    }

    let initialValues = {
        nom: globalState?.settings?.entreprise?.nom || "",
        adresse1: globalState?.settings?.entreprise?.adresse1 || "",
        adresse2: globalState?.settings?.entreprise?.adresse2 || "",
        code_postal: globalState?.settings?.entreprise?.code_postal || "",
        ville: globalState?.settings?.entreprise?.ville || "",
        telephone: globalState?.settings?.entreprise?.telephone || "",
        email: globalState?.settings?.entreprise?.email || "",
        siret: globalState?.settings?.entreprise?.siret || "",
        rcs: globalState?.settings?.entreprise?.rcs || "",
    }

    let initialValuesPaiement = {
        nom: globalState?.settings?.paiement?.nom || '',
        iban: globalState?.settings?.paiement?.iban || '',
        order: globalState?.settings?.paiement?.order || '',
    }

    return <Box>

        <Loader display={displayLoader} />

        <List>
            <Formik
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setDisplayLoader(true);
                    await props.dispatch(actions.set.saveEntrepriseSettings(values));
                    props.snackbar.success(intl.formatMessage({ id: 'settings.societe.saved' }));
                    setDisplayLoader(false);
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                        <ListItem disablePadding>
                            <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.societe.title' })}</Typography>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Nom" />
                            <TextField error={(errors.nom && touched.nom) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Adresse" />
                            <TextField error={(errors.adresse1 && touched.adresse1) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="adresse1" value={values.adresse1} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Adresse (complément)" />
                            <TextField error={(errors.adresse2 && touched.adresse2) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="adresse2" value={values.adresse2} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Code Postal" />
                            <InputMask error={(errors.code_postal && touched.code_postal) ? true : false} value={values.code_postal} mask="99999" maskChar=" " name="code_postal" alwaysShowMask={false} onChange={handleChange}>
                                {(inputProps) => <TextField {...inputProps} variant="standard" sx={{ textAlign: "center" }} disableunderline />}
                            </InputMask>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ville" />
                            <TextField error={(errors.ville && touched.ville) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="ville" value={values.ville} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Telephone" />
                            <InputMask error={(errors.telephone && touched.telephone) ? true : false} value={values.telephone} mask="99.99.99.99.99" maskChar=" " name="telephone" alwaysShowMask={false} onChange={handleChange}>
                                {(inputProps) => <TextField {...inputProps} variant="standard" sx={{ textAlign: "center" }} disableunderline />}
                            </InputMask>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Mail" />
                            <TextField error={(errors.email && touched.email) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="email" value={values.email} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Siret" />
                            <TextField error={(errors.siret && touched.siret) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="siret" value={values.siret} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ville ( RCS )" />
                            <TextField error={(errors.rcs && touched.rcs) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="rcs" value={values.rcs} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={2} />
                                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                                    <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                                        <Button variant="contained" type="submit">
                                            {intl.formatMessage({ id: 'settings.database.societe.save' })}
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={2} />
                            </Grid>
                        </ListItem>
                    </Form>
                )}
            </Formik>
            <br />
            <Formik
                initialValues={initialValuesPaiement}
                validationSchema={ValidationSchemaPaiement}
                onSubmit={async (values, { setSubmitting }) => {
                    setDisplayLoader(true);
                    await props.dispatch(actions.set.savePaiementSettings(values));
                    props.snackbar.success(intl.formatMessage({ id: 'settings.paiement.saved' }));
                    setDisplayLoader(false);
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                        <ListItem disablePadding>
                            <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.paiement.title' })}</Typography>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Nom associé au compte bancaire" />
                            <TextField error={(errors.nom && touched.nom) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="IBAN" />
                            <TextField error={(errors.iban && touched.iban) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="iban" value={values.iban} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Chéque a l'ordre de" />
                            <TextField error={(errors.order && touched.order) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="order" value={values.order} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={2} />
                                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                                    <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                                        <Button variant="contained" type="submit">
                                            {intl.formatMessage({ id: 'settings.database.societe.save' })}
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={2} />
                            </Grid>
                        </ListItem>
                    </Form>
                )}
            </Formik>
            <br />
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.logo.title' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={2} />
                    <Grid item xs={8} sx={{ textAlign: 'center' }}>
                        {globalState?.settings?.logo && <img src={/*'data:image/png;base64,' +*/ globalState?.settings?.logo} width={305 / 2} height={140 / 2} />}
                        {!globalState?.settings?.logo && <Typography variant="h8" gutterBottom component="div">{intl.formatMessage({ id: 'settings.logo.no' })}</Typography>}
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={2} />
                    <Grid item xs={8} sx={{ textAlign: 'center' }}>
                        <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                            <input
                                style={{ display: 'none' }}
                                ref={inputRef}
                                type="file"
                                onChange={handleFileChange}
                            />
                            <Button variant="contained" onClick={async () => {
                                try {
                                    setDisplayLoader(true);
                                    // 👇️ open file input box on click of another element
                                    inputRef.current.click();
                                } catch (err) {
                                    props.snackbar.error(err.message);
                                }
                            }}>
                                {intl.formatMessage({ id: 'settings.logo.select' })}
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} >
                        <DeleteForeverIcon sx={{ marginTop: "5px", cursor: "pointer" }} onClick={() => {
                            props.dispatch(actions.set.saveEntrepriseLogo(new Buffer("").toString('base64')));
                            setDisplayLoader(false);
                        }} />
                    </Grid>
                </Grid>
            </ListItem>
            <br />
            {/*<ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.online.mode' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Synchronisation en ligne" />
                <Switch checked={globalState?.settings?.onlineMode} onChange={async (event) => {
                    await props.dispatch(actions.set.saveSettings({ onlineMode: event.target.checked }));
                }} />
            </ListItem>
            {globalState?.settings?.onlineMode && <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={6} >
                        {"Identifiant unique du compte"}
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "right" }}>
                        {globalState?.settings?.uuid}
                        <EditIcon sx={{ cursor: 'pointer', marginLeft: "15px" }} onClick={() => {
                            setDisplayChangeUUIDModal(true);
                        }} />
                    </Grid>
                </Grid>
            </ListItem>}
            {globalState?.settings?.onlineMode && <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={6} >
                        {"QRCode unique du compte"}
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "right" }}>
                        <img src={uuidImg} alt="" />
                    </Grid>
                </Grid>
            </ListItem>}
            <br />
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.install.database' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Installer la base de données" />
                <Button variant="contained" style={{ textAlign: "right" }} onClick={() => {
                    setDisplayDatabaseInstaller(true);
                }}>Installation</Button>
            </ListItem>*/}
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.database.title' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={2} />
                    <Grid item xs={8} sx={{ textAlign: 'center' }}>
                        <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                            <Button variant="contained" onClick={async () => {

                                try {
                                    setDisplayLoader(true);
                                    const filename = (await props.dispatch(actions.electron.getFilenameForSave('.json')))?.getFilenameForSave;
                                    if (filename.canceled == false) {
                                        let dump = await props.dispatch(actions.database.dumpFromDB());
                                        await props.dispatch(actions.electron.writeFile(filename.filePath, JSON.stringify(dump.dump)));

                                        props.snackbar.success(intl.formatMessage({ id: 'settings.database.export.success' }));
                                    }
                                } catch (err) {
                                    props.snackbar.error(err.message);
                                } finally {
                                    setDisplayLoader(false);
                                }
                            }}>
                                {intl.formatMessage({ id: 'settings.database.export' })}
                            </Button>
                            <Button variant="contained" onClick={async () => {
                                try {
                                    setDisplayLoader(true);
                                    const filename = (await props.dispatch(actions.electron.getFilenameForOpen('.json')))?.getFilenameForOpen;
                                    if (filename.canceled == false) {
                                        let fileData = (await props.dispatch(actions.electron.readFile(filename.filePath)))?.fileData;
                                        if (filename.filePath.includes(".json")) {
                                            await props.dispatch(actions.database.restoreFromJSON(JSON.parse(fileData)));
                                        }
                                        props.snackbar.success('settings.database.import.success');
                                    }
                                } catch (err) {
                                    props.snackbar.error(err.message);
                                } finally {
                                    setDisplayLoader(false);
                                }
                            }}>
                                {intl.formatMessage({ id: 'settings.database.import' })}
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </ListItem>
            <br />
            {/*<ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.install.database' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Installer la base de donnée" />
                <Switch checked={globalState.settings.useDatabase ? globalState.settings.useDatabase : false} onChange={async (event) => {
                    await props.dispatch(actions.set.saveSettings({useDatabase : event.target.checked}));
                    // if ( event.target.checked == true ){
                     //    await props.dispatch(actions.database.installTecdocDatabase());
                     //}
                }} />
            </ListItem>*/}
            {/*((globalState.settings?.useCatalog == 1) || (globalState.settings?.useCatalog == true)) && <ListItem>
                <ListItemText primary="Selectionner les Fabriquants" />
                <Button variant="contained" style={{ textAlign: "right" }} onClick={() => {
                    setDisplayAmBrandsSelector(true);
                }}>Selectionner les Fabriquants</Button>
            </ListItem>}
            <br />*/}
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.adminMode' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary="Mode Admin" />
                <Switch
                    checked = {globalState?.settings?.tempSettings?.godMode}
                    onChange={async (event) => {
                        event.target.checked ? setDisplayPasswordAskForGodMode(event.target.checked) : props.dispatch(actions.set.tempSettings({ godMode: event.target.checked }));  
                    }} />
            </ListItem>
            <ListItem>
                <ListItemText primary="Ouvrir la console" />
                <Switch 
                checked = {globalState.debugConsole}
                onChange={async (event) => {
                    event.target.checked ? setDisplayPasswordAskForDebug(event.target.checked) : props.dispatch(actions.debug.toggleConsole(event.target.checked));
                }} />
            </ListItem>
        </List>

        <ChangeUUIDModal
            display={displayChangeUUIDModal}
            value={globalState?.settings?.uuid}
            onClose={() => {
                setDisplayChangeUUIDModal(false);
            }}
            onValid={async (value) => {
                if (value != undefined) {
                    await props.dispatch(actions.set.saveUuid({ uuid: value }));
                }
                setDisplayChangeUUIDModal(false);
            }}
        />

        {displayDatabaseInstaller && <Installation
            display={displayDatabaseInstaller}
            onFinish={async () => {
                setDisplayDatabaseInstaller(false);
            }}
        />}

        {displayPasswordAskForGodMode && <PasswordAsk
            title={intl.formatMessage({ id: 'settings.admin.password.title' })}
            label={intl.formatMessage({ id: 'settings.admin.password.label' })}
            password={process.env.REACT_APP_GODMODE_PASSWORD}
            display={displayPasswordAskForGodMode}
            onClose={()=> {
                setDisplayPasswordAskForGodMode(false);
            }}
            onValidate={async (val)=>{
                await props.dispatch(actions.set.tempSettings({ godMode: val }))
                setDisplayPasswordAskForGodMode(false);
            }}
        />} 
        {displayPasswordAskForDebug && <PasswordAsk
            title={intl.formatMessage({ id: 'settings.admin.password.title' })}
            label={intl.formatMessage({ id: 'settings.admin.password.label' })}
            password={process.env.REACT_APP_DEBUG_PASSWORD}
            display={displayPasswordAskForDebug}
            onClose={()=> {
                setDisplayPasswordAskForDebug(false);
            }}
            onValidate={async (val)=>{
                await props.dispatch(actions.debug.toggleConsole(val));
                setDisplayPasswordAskForDebug(false);
            }}
        />}

        {displayAmBrandsSelector && <AmBrandsSelectorForInstallationModal
            display={displayAmBrandsSelector}
            tecdoc_server={globalState.tecdoc_server || {}}
            tecdoc={globalState.tecdoc || []}
            onClose={() => {
                setDisplayAmBrandsSelector(false);
            }}
            onCancel={async () => {
                setDisplayAmBrandsSelector(false);
            }}
            onValidate={(selectedAmBrands) => {
                let installed = globalState.tecdoc.filter((el) => el.installed);
                let installAmBrands = selectedAmBrands.map((amBrand) => {
                    if (installed.find((el) => el.ambrand == amBrand) == undefined) {
                        return amBrand;
                    }
                }).filter((el) => el != undefined);
                let removeAmBrands = globalState.tecdoc.filter((el) => el.installed);
                removeAmBrands = removeAmBrands.map((el) => {
                    if (selectedAmBrands.find((f) => f == el.ambrand) == undefined) {
                        return el;
                    }
                }).filter((el) => el != undefined);

                if (installAmBrands.length > 0) {
                    props.dispatch(actions.database.installTecdocDatabase(installAmBrands));
                }
                if (removeAmBrands.length > 0) {
                    props.dispatch(actions.database.removeTecDocDatabase(removeAmBrands));
                }
                setDisplayAmBrandsSelector(false);
            }}
        />}
    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(SettingsPage)));
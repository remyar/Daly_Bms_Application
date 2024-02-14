import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from "react-router-dom";
import NavigationProvider from './providers/navigation';
import StoreProvider from './providers/StoreProvider';
import SnackBarGenerator from './providers/snackBar';
import CssBaseline from '@mui/material/CssBaseline';
import api from "./api";
import GlobalStyles from '@mui/material/GlobalStyles';

// i18n datas
import localeData from './locales';
import database from "./database";

const electron = require('@electron/remote');

async function startApp() {

    try {
        await database.start();
    } catch (err) {
        console.error(err);
    }

    let settings = await database.getSettings() || {};

    // Define user's language. Different browsers have the user locale defined
    // on different fields on the `navigator` object, so we make sure to account
    // for these different by checking all of them
    const language = (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;

    window.userLocale = language;

    // Split locales with a region code
    let languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

    window.userLocaleWithoutRegionCode = languageWithoutRegionCode;
    localeData.setLocale(languageWithoutRegionCode);
    // Try full locale, try locale without region code, fallback to 'en'
    const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

    const root = createRoot(document.getElementById('root'));

    let _settings = {
        ...settings
    }

    root.render(
        <React.Fragment>
            <GlobalStyles
                styles={{
                    h1: { color: 'grey' },
                    '*::-webkit-scrollbar': {
                        width: '0.4em',
                    },
                    '*::-webkit-scrollbar-track': {
                        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,.1)',
                        outline: '0px solid slategrey',
                    },
                }}
            />
            <CssBaseline />

            <StoreProvider extra={{ api, database, electron }} globalState={{
                settings: { installed: false, locale: "fr", ..._settings },
            }}>
                <MemoryRouter>
                    <NavigationProvider>
                        <IntlProvider locale={language} messages={messages}>
                            <SnackBarGenerator>
                                <App />
                            </SnackBarGenerator>
                        </IntlProvider>
                    </NavigationProvider>
                </MemoryRouter>
            </StoreProvider>
        </React.Fragment>
    );

}

startApp();
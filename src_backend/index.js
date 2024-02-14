const { app, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const serial = require('./serial');

let mainWindow = undefined;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try {
            
            ipcMain.handle('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

            Object.keys(serial).forEach((key) => {
                ipcMain.handle('serial.' + key, async (event, value) => {
                    return (await serial[key](value));
                });
            });

        } catch (err) {
            console.error(err);
        }
    }
}
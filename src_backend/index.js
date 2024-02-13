const { app, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');


let mainWindow = undefined;

module.exports = {

    setMainWindows: async (_mainWindow) => {
        mainWindow = _mainWindow;
    },
    start: async () => {
        try {
            
            ipcMain.on('OPEN_DEV_TOOLS', (event, value) => {
                if (value) {
                    mainWindow.webContents.openDevTools();
                } else {
                    mainWindow.webContents.closeDevTools();
                }
            });

        } catch (err) {
            console.error(err);
        }
    }
}
import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function setSerialPort(path, { extra, getState }) {
    try {
        let result = await ipcRenderer.invoke("serial.setSerialPort", path);
        return;
    } catch (err) {
        return;
    }
}

export default createAction(setSerialPort);
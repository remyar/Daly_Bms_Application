import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getMinMaxCellVoltage({ extra, getState }) {
    try {
        let result = await ipcRenderer.invoke("serial.getMinMaxCellVoltage");
        return { minMaxCellVoltage: result };
    } catch (err) {
        return;
    }
}

export default createAction(getMinMaxCellVoltage);
import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getSerialPortsList({ extra, getState }) {
    let retObj = { serialPorts: [] };
    try {
        let result = await ipcRenderer.invoke("serial.getSerialPortsList");
        retObj.serialPorts = [...result];
    } catch (err) {
        retObj.serialPorts = [];
    }
    return { ...retObj };
}

export default createAction(getSerialPortsList);
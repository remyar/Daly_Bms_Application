import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getPackTemp({ extra, getState }) {
    try {
        let result = await ipcRenderer.invoke("serial.getPackTemp");
        return { packTemps: result };
    } catch (err) {
        return;
    }
}

export default createAction(getPackTemp);
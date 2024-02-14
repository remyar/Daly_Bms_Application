import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getStatusInfos({ extra, getState }) {
    try {
        let result = await ipcRenderer.invoke("serial.getStatusInfos");
        return { statusInfos: result };
    } catch (err) {
        return;
    }
}

export default createAction(getStatusInfos);
import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getpackMeasurements({ extra, getState }) {
    try {
        let result = await ipcRenderer.invoke("serial.getpackMeasurements");
        return { packMeasurements: result };
    } catch (err) {
        return;
    }
}

export default createAction(getpackMeasurements);
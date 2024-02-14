import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function getCellsVoltages(nbCells , { extra, getState }) {
    try {
        let result = await ipcRenderer.invoke("serial.getCellsVoltages", nbCells);
        return { cellsVoltages: result };
    } catch (err) {
        return;
    }
}

export default createAction(getCellsVoltages);
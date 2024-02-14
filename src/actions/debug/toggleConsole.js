import createAction from '../../middleware/actions';
import { ipcRenderer } from 'electron';

export async function toggleConsole(value = false, { extra, getState }) {
    ipcRenderer.invoke("OPEN_DEV_TOOLS", value);
    return { debugConsole : value}
}

export default createAction(toggleConsole);
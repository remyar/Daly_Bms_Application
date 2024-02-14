import createAction from '../../middleware/actions';

export async function saveSettings(value = {}, { extra, getState }) {

    const database = extra.database;

    let settings = getState().settings || {};

    settings = { ...settings, ...value };

    try {

        let result = await database.saveSettings(settings);

        return { settings: { ...settings, ...result } };

    } catch (err) {

        throw { message: err.message };
    }
}

export default createAction(saveSettings);
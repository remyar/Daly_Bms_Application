
const databasename = "library";
const databaseVersion = 4;

let db;

async function start() {
    return new Promise((resolve, reject) => {
        // Check for support.
        if (!('indexedDB' in window)) {
            console.log("This browser doesn't support IndexedDB.");
            return;
        }

        const request = indexedDB.open(databasename, databaseVersion);

        request.onupgradeneeded = function () {
            // The database did not previously exist, so create object stores and indexes.
            db = request.result;

            if (db.objectStoreNames.contains("settings") == false) {
                db.createObjectStore("settings", { keyPath: "id" });
            }
            if (db.objectStoreNames.contains("version") == false) {
                db.createObjectStore("version", { keyPath: "id" });
            }
        };

        request.onerror = function (err) {
            console.error(err);
            reject(err);
        };

        request.onsuccess = function () {
            db = request.result;
            resolve(db);
        };
    });
}

async function deleteDB() {
    return new Promise((resolve, reject) => {

        db.close();

        var req = indexedDB.deleteDatabase(databasename);
        req.onsuccess = function () {
            console.log("Deleted database successfully");
            resolve("Deleted database successfully");
        };
        req.onerror = function () {
            console.log("Couldn't delete database");
            reject("Couldn't delete database");
        };
        req.onblocked = function () {
            console.log("Couldn't delete database due to the operation being blocked");
            reject("Couldn't delete database due to the operation being blocked");
        };
    });
}

async function dump() {
    return new Promise(async (resolve, reject) => {
        try {
            let settings = await getSettings();

            resolve({ settings });
        } catch (err) {

        }
    });
}

async function restore(datas) {

    return new Promise(async (resolve, reject) => {

        try {
            await deleteDB();
            await start();

            if (datas.settings && datas.settings.length > 0) {
                await saveSettings(datas.settings[0]);
            }
            else if (datas.settings) {
                await saveSettings(datas.settings);
            }

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

async function getVersion() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('version', 'readwrite');
            let settings_general = transaction.objectStore('version');

            let settings = settings_general.get(1);
            settings.onsuccess = function () {
                resolve(settings.result);
            };

            settings.onerror = function () {
                reject(settings.error);
            };
        } catch (err) {
            reject(err.message);
        }
    })

}

async function saveVersion(_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('version', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_data);
            };

            let settings_general = transaction.objectStore('version');

            let __data = {
                id: 1,
                ..._data
            }

            settings_general.put(__data);

        } catch (err) {
            reject(err.message);
        }
    });
}

async function saveSettings(_settings) {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('settings', 'readwrite');

            transaction.oncomplete = function () {
                resolve(_settings);
            };

            let settings_general = transaction.objectStore('settings');

            let settings = {
                id: 1,
                ..._settings
            }

            settings_general.put(settings);
        } catch (err) {
            reject(err.message);
        }
    })

}

async function getSettings() {
    return new Promise(async (resolve, reject) => {
        try {
            let transaction = db.transaction('settings', 'readwrite');
            let settings_general = transaction.objectStore('settings');

            let settings = settings_general.get(1);
            settings.onsuccess = function () {
                resolve(settings.result);
            };

            settings.onerror = function () {
                reject(settings.error);
            };
        } catch (err) {
            reject();
        }
    })

}



export default {
    start,
    dump,
    restore,

    getVersion,
    saveVersion,

    getSettings,
    saveSettings,
}
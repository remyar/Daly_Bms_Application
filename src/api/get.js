
import fetch from 'electron-fetch';

export default function get(url, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 30000);

            const response = await fetch(url, { ...config, useElectronNet: false, signal: controller.signal, credentials: "same-origin", useSessionCookies: true });

            clearTimeout(id);

            if (response.status == 200) {
                let r = undefined;
                if (config && config.responseType && config.responseType == 'arraybuffer') {
                    r = await response.arrayBuffer();
                } else {
                    if (response.headers.get('content-type').includes("text/html")) {
                        r = await response.text();
                    } else if (response.headers.get('content-type').includes("application/json")) {
                        r = await response.json();
                    }
                }
                resolve(r);
            } else if (response.status == 404) {
                reject({ message: "Not found" });
            } else if (response.status == 204) {
                reject({ message: "Unknow Vehicule" });
            } else if (response.status == 500) {
                reject({ message: "Temporary unavailable" });
            } else {
                reject({ message: "To many request" });
            }

        } catch (err) {
            reject(err);
        }
    });
}
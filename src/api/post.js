import fetch from 'electron-fetch';

export default function post(url, data, config = {}) {
    return new Promise(async (resolve, reject) => {
        try {

            let headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            };

            let response = await fetch(url, {
                ...config,
                method: "POST",
                useElectronNet: false,
                credentials: "same-origin",
                body: JSON.stringify(data),
                headers: new Headers(headers)
            });
            if (response.status == 200) {
                let r = undefined;
                if (config && config.responseType && config.responseType == 'arraybuffer') {
                    r = await response.arrayBuffer();
                } else {
                    if (response.headers && response.headers.get('content-type').includes("text/html")) {
                        r = await response.text();
                    } else if (response.headers.get('content-type').includes("application/json")) {
                        r = await response.json();
                    } else {
                        r = await response.json();
                    }
                }
                resolve(r)
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
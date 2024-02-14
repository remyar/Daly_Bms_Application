const { SerialPort } = require('serialport');

const usbDevices = [
    { vendorId: '067B', productId: '2303', devices: ["23ManRanProbe"] },
]

let portCom = undefined;
let frame = [];

const BMS_RESET = 0x00;
const VOUT_IOUT_SOC = 0x90;
const MIN_MAX_CELL_VOLTAGE = 0x91;
const MIN_MAX_TEMPERATURE = 0x92;
const STATUS_INFO = 0x94;
const CELL_VOLTAGES = 0x95;

async function getSerialPortsList() {
    try {
        const ports = (await SerialPort.list()).map((p) => {
            let usbDevice = usbDevices.find((usb) => usb.vendorId == p.vendorId && usb.productId == p.productId);
            if (usbDevice) {
                return { path: p.path };
            }
        }).filter((f) => f != undefined);

        return ports;
    } catch (err) {
        throw Error(err);
    }
}

async function setSerialPort(value) {
    try {
        portCom = new SerialPort({ path: value, autoOpen: false, baudRate: 9600 });
        portCom.on('data', (data) => {
            frame = [...frame, ...data];
        });
    } catch (err) {
        throw Error(err);
    }
}

async function open() {
    return new Promise((resolve, reject) => {
        portCom.open(function (err) {
            if (err) {
                reject('Error opening port: ', err.message);
                return;
            }

            resolve(portCom);
        });
    });
}

async function receiveBytes() {
    return new Promise((resolve, reject) => {
        let timeout = 1000;
        let interval = setInterval(() => {
            if (frame.length >= 13) {
                clearInterval(interval);
                let _frame = frame.splice(0, 13);

                //-- verif checksum
                let chekSumCal = 0;
                for (let i = 0; i < 12; i++) {
                    chekSumCal += _frame[i];
                }

                if ((chekSumCal & 0xFF) == _frame[12]) {
                    resolve(_frame);
                    return;
                } else {
                    reject("Error CheckSum");
                    return;
                }
            }
            timeout -= 10;
            if (timeout <= 0) {
                clearInterval(interval);
                reject("Timeout");
                return;
            }
        }, 10);
    });
}

async function write(_data) {
    return new Promise(async (resolve, reject) => {
        if (portCom) {
            if (portCom.isOpen == false) {
                await open();
            }
            if (portCom.isOpen == true) {
                portCom.write(_data);
                portCom.drain((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        }
    });
}
async function sendCommand(cmdId) {
    try {
        let checksum = 0;
       
        let buffer = [0xA5, 0x40, cmdId, 0x08, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // Calculate the checksum
        for (let d of buffer) {
            checksum += d;
        }
        buffer[12] = checksum & 0xff;
        frame = [];
        await write(buffer);
    } catch (err) {
        throw Error(err);
    }
}

async function setDischargeMOS( sw ){
    try {
        let checksum = 0;

        let buffer = [0xA5, 0x40, 0xD9, 0x08, sw == true ? 1 : 0 , 0, 0, 0, 0, 0, 0, 0, 0];
        // Calculate the checksum
        for (let d of buffer) {
            checksum += d;
        }
        buffer[12] = checksum & 0xff;
        frame = [];
        await write(buffer);

        await receiveBytes();

    } catch (err) {
        throw Error(err);
    }
}

async function getpackMeasurements() {
    try {
        let obj = {};

        await sendCommand(VOUT_IOUT_SOC);
        let _frame = await receiveBytes();


        // Pull the relevant values out of the buffer
        obj.packVoltage = ((_frame[4] << 8) + _frame[5]) / 10.0;
        obj.gatherTotalVoltage = ((_frame[6] << 8) + _frame[7]) / 10.0;
        // The current measurement is given with a 30000 unit offset (see /docs/)
        obj.packCurrent = (((_frame[8] << 8) + _frame[9]) - 30000) / 10.0;
        obj.packSOC = (((_frame[10] << 8) + _frame[11]) / 10.0);

        return obj;
    } catch (err) {
        console.error(err)
    }
}


async function getMinMaxCellVoltage() {
    try {
        let obj = {};

        await sendCommand(MIN_MAX_CELL_VOLTAGE);
        let _frame = await receiveBytes();

        obj.maxCellmV = ((_frame[4] << 8) + _frame[5]);
        obj.maxCellVNum = _frame[6];
        obj.minCellmV = ((_frame[7] << 8) + _frame[8]);
        obj.minCellVNum = _frame[9];
        obj.cellDiff = (obj.maxCellmV - obj.minCellmV);

        return obj;
    } catch (err) {
        console.error(err);
    }
}

async function getStatusInfos() {
    try {
        let obj = {};

        await sendCommand(STATUS_INFO);
        let _frame = await receiveBytes();

        obj.numberOfCells = _frame[4];
        obj.numOfTempSensors = _frame[5];
        obj.chargeState = _frame[6];
        obj.loadState = _frame[7];

        return obj;
    } catch (err) {
        console.error(err);
    }
}

async function getCellsVoltages(nbCells) {
    try {
        let obj = { cellVmV : []};
        let cellNo = 0;
        await sendCommand(CELL_VOLTAGES);

        for (let i = 0; i <= Math.ceil(nbCells / 3); i++) {
            let _frame = await receiveBytes();
            for (let j = 0; j < 3; j++){
                obj.cellVmV[cellNo] = (_frame[5 + j*2] << 8) + _frame[6 + j*2];
                cellNo++;
                if (cellNo >= nbCells)
                    break;
            }
            if (cellNo >= nbCells)
                break;
        }

        return obj;
    } catch (err) {
        console.error(err);
    }
}

async function getPackTemp(){
    try {
        let obj = {};
        await sendCommand(MIN_MAX_TEMPERATURE);
        let _frame = await receiveBytes();
        obj.tempMax = _frame[4] - 40;
        obj.tempMin = _frame[6] - 40;
        obj.tempAverage = (obj.tempMax + obj.tempMin) / 2.0;

        return obj;
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    getSerialPortsList,
    setSerialPort,
    getpackMeasurements,
    getMinMaxCellVoltage,
    getStatusInfos,
    getCellsVoltages,
    getPackTemp,
}
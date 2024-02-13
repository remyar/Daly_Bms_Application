
const tesseract = require("node-tesseract-ocr")
var Jimp = require("jimp").default;
const electron = require('@electron/remote').app;
const path = require('path');
const fs = require('fs');

async function getText(image) {
    return new Promise(async (resolve, reject) => {
        try {
            let srcImage = await Jimp.read(Buffer.from(image, 'base64'));
            //-- find the first color
            let backGroundColor = srcImage.getPixelColor(0, 0);
            let tryToRemoveColor = [];
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < srcImage.getWidth(); x++) {

                    if (srcImage.getPixelColor(x, y) !== backGroundColor) {
                        tryToRemoveColor.push(srcImage.getPixelColor(x, y));
                    }
                }
            }

            //-- remove color
            for (let y = 0; y < srcImage.getHeight(); y++) {
                for (let x = 0; x < srcImage.getWidth(); x++) {
                    if (tryToRemoveColor.find((el) => el === srcImage.getPixelColor(x, y))) {
                        srcImage.setPixelColor(0xFFFFFFFF, x, y);
                    }
                }
            }

            let colorImage = [
                srcImage.getPixelColor(7, 30),
                srcImage.getPixelColor(43, 30),
                srcImage.getPixelColor(78, 30),
                srcImage.getPixelColor(115, 30),
                srcImage.getPixelColor(151, 30),
            ]

            for (let y = 0; y < srcImage.getHeight(); y++) {
                for (let x = 0; x < srcImage.getWidth(); x++) {
                    let colorIsFound = false;
                    colorImage.forEach((el) => {
                        if (el === srcImage.getPixelColor(x, y)) {
                            colorIsFound = true;
                        }
                    })
                    if (colorIsFound === false) {
                        srcImage.setPixelColor(0xFFFFFFFF, x, y);
                    }
                }
            }


            for (let x = 0; x < srcImage.getWidth(); x++) {
                for (let y = 0; y < srcImage.getHeight(); y++) {
                    if (srcImage.getPixelColor(x, y) !== 0xFFFFFFFF) {
                        srcImage.setPixelColor(0, x, y);
                    }
                }
            }

            for (let x = 0; x < srcImage.getWidth(); x++) {
                for (let y = 0; y < srcImage.getHeight(); y++) {
                    if (srcImage.getPixelColor(x, y) === 0xFFFFFFFF) {
                        srcImage.setPixelColor(0, x, y);
                    } else {
                        srcImage.setPixelColor(0xFFFFFFFF, x, y);
                    }
                }
            }

            for (let y = 0; y < 18; y++) {
                for (let x = 0; x < srcImage.getWidth(); x++) {
                    srcImage.setPixelColor(0xFFFFFFFF, x, y);
                }
            }

            for (let y = 60; y >= 46; y--) {
                for (let x = 0; x < srcImage.getWidth(); x++) {
                    srcImage.setPixelColor(0xFFFFFFFF, x, y);
                }
            }

            for (let y = 0; y < srcImage.getHeight(); y++) {
                let lineIsBlack = true;
                for (let x = 0; x < srcImage.getWidth(); x++) {
                    if (srcImage.getPixelColor(x, y) === 0xFFFFFFFF) {
                        lineIsBlack = false
                    }
                }

                if (lineIsBlack) {
                    for (let x = 0; x < srcImage.getWidth(); x++) {
                        srcImage.setPixelColor(0xFFFFFFFF, x, y);
                    }
                }
            }

            for (let x = 0; x < 10; x++) {
                for (let y = 0; y < srcImage.getHeight(); y++) {
                    srcImage.setPixelColor(0xFFFFFFFF, x, y);
                }
            }

            await srcImage.writeAsync("./img-opt.jpg");

            const config = {
                lang: "eng",
                oem: 3,
                psm: 13,
                tessedit_char_whitelist: "ABCDFGHJMNPQSUVWXYZ",
                presets: ["txt"],
            }

            if (fs.existsSync(path.resolve("./assets/", "tesseract", "tesseract.exe")) === true) {
                config.binary = path.resolve("./assets/", "tesseract", "tesseract.exe");
            }

            if (fs.existsSync(path.resolve(electron.getPath("userData"), "tesseract", "tesseract.exe")) === true) {
                config.binary = path.resolve(electron.getPath("userData"), "tesseract", "tesseract.exe");
            }

            let text = await tesseract.recognize("./img-opt.jpg", config)
            if (text.trim().length === 5) {
                resolve(text.trim());
            } else {
                reject("fail to process");
            }


        } catch (err) {
            reject(err);
        }
    });
}

export default {
    getText
}
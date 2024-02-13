module.exports = (param) => ((param === "NaN") || (param === null ) || (param === undefined)) ? true : Number.isNaN(param);

import sleep from './sleep';
import isNaNOrNullOrUndefined from './isNaNOrNullOrUndefined';

Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

Date.prototype.getFullDate = function(){
    var date = this.getDate();
    if ( date < 10 ){
        date = '0' + date;
    }
    return date;
}

Date.prototype.getFullMonth = function(){
    var month = this.getMonth() + 1;
    if ( month < 10 ){
        month = '0' + month;
    }
    return month;
}

export default {
    sleep,
    isNaNOrNullOrUndefined,
}
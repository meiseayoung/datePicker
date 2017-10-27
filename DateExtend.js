/**
 * 功能说明: 格式化时间为字符串
 * 参数说明:
 * @param pattern [String] 格式化字符串
 * @return [String] 格式化后的字符串
 */
Date.prototype.format = function(pattern) {
    function zeroize(num) {
        return num < 10 ? "0" + num : num;
    };
    var pattern = pattern; //    YYYY-MM-DD 或 MM-DD-YYYY 或 YYYY-MM-DD , hh : mm : ss
    var dateObj = {
        "Y": this.getFullYear(),
        "M": zeroize(this.getMonth() + 1),
        "D": zeroize(this.getDate()),
        "h": zeroize(this.getHours()),
        "m": zeroize(this.getMinutes()),
        "s": zeroize(this.getSeconds())
    };
    return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, function(match) {
        switch (match) {
            case "YYYY":
                return dateObj.Y;
            case "MM":
                return dateObj.M;
            case "DD":
                return dateObj.D;
            case "hh":
                return dateObj.h;
            case "mm":
                return dateObj.m;
            case "ss":
                return dateObj.s;
        };
    });
};
/**
 * 功能说明: 向前推移指定天数并格式化为字符串
 * 参数说明:
 * @param pattern [String] 格式化字符串
 * @param pastDays [Number] 过去几天
 * @return [String] 格式化后的字符串
 */
Date.prototype.past = function(pattern, pastDays) {
    function zeroize(num) {
        return num < 10 ? "0" + num : num;
    };
    var pastday = new Date((this - 0) - 1000 * 60 * 60 * 24 * pastDays);
    var pattern = pattern; //    YYYY-MM-DD 或 MM-DD-YYYY 或 YYYY-MM-DD , hh : mm : ss
    var dateObj = {
        "Y": pastday.getFullYear(),
        "M": zeroize(pastday.getMonth() + 1),
        "D": zeroize(pastday.getDate()),
        "h": zeroize(pastday.getHours()),
        "m": zeroize(pastday.getMinutes()),
        "s": zeroize(pastday.getSeconds())
    };
    return pattern.replace(/YYYY|MM|DD|hh|mm|ss/g, function(match) {
        switch (match) {
            case "YYYY":
                return dateObj.Y;
            case "MM":
                return dateObj.M;
            case "DD":
                return dateObj.D;
            case "hh":
                return dateObj.h;
            case "mm":
                return dateObj.m;
            case "ss":
                return dateObj.s;
        };
    });
};
/**
 * 功能说明: 格式化昨天并格式化字符
 * 参数说明:
 * @param pattern [String] 格式化字符串
 * @return [String] 格式化后的字符串
 */
Date.prototype.yestoday = function(pattern) {
    return this.past(pattern, 1);
};
/**
 * 功能说明: 格式化明天并格式化字符
 * 参数说明:
 * @param pattern [String] 格式化字符串
 * @return [String] 格式化后的字符串
 */
Date.prototype.tomorrow = function(pattern) {
    return this.past(pattern, -1);
};
// Date.prototype.getMonthDays = function() { //Date()方法中日期必须传入32号
//     return 32 - parseInt(this.format("DD"));
// };
/**
 * 功能说明: 获取当前月的天数
 * 参数说明:
 * 无参数
 * @return [Number] 当前月的天数
 */
Date.prototype.getMonthDays = function() {
    var currentMonth = this.format("MM");
    var currentMonthUTC = this.getTime();
    var oneDay = 24 * 60 * 60 * 1000;
    while(new Date(currentMonthUTC).format("MM") == currentMonth){
        currentMonthUTC += oneDay;
    }
    return Number(new Date(currentMonthUTC - oneDay).format("DD"));
};
/**
 * 功能说明: 获取当天的星期索引
 * 参数说明:
 * 无参数
 * @return [Number] 当天的星期索引
 */
Date.prototype.getWeekIndex = function() {
    var weekList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var weekID = this.toUTCString().split(",")[0];
    return weekList.indexOf(weekID)==0?7:weekList.indexOf(weekID);
}
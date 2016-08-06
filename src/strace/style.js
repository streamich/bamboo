"use strict";
exports.CODES = (_a = {},
    _a[0] = [0, 0],
    _a[1] = [1, 21],
    _a[2] = [2, 22],
    _a[3] = [3, 23],
    _a[4] = [4, 24],
    _a[5] = [5, 25],
    _a[6] = [7, 27],
    _a[7] = [8, 28],
    _a[8] = [9, 29],
    _a[9] = [39, 39],
    _a[10] = [30, 39],
    _a[11] = [31, 39],
    _a[12] = [32, 39],
    _a[13] = [33, 39],
    _a[14] = [34, 39],
    _a[15] = [35, 39],
    _a[16] = [36, 39],
    _a[17] = [97, 39],
    _a[18] = [90, 39],
    _a[19] = [37, 39],
    _a[20] = [91, 39],
    _a[21] = [92, 39],
    _a[22] = [93, 39],
    _a[23] = [94, 39],
    _a[24] = [95, 39],
    _a[25] = [94, 39],
    _a[26] = [40, 49],
    _a[27] = [41, 49],
    _a[28] = [42, 49],
    _a[29] = [43, 49],
    _a[30] = [44, 49],
    _a[31] = [45, 49],
    _a[32] = [46, 49],
    _a[33] = [107, 49],
    _a[34] = [100, 49],
    _a[35] = [101, 49],
    _a[36] = [102, 49],
    _a[37] = [103, 49],
    _a[38] = [104, 49],
    _a[39] = [105, 49],
    _a[40] = [106, 49],
    _a[41] = [47, 49],
    _a
);
function style(msg, style) {
    var _a = exports.CODES[style], start = _a[0], end = _a[1];
    return "\u001B[" + start + "m" + msg + "\u001B[" + end + "m";
}
exports.style = style;
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
function interval(ms) {
    if (ms >= d)
        return Math.round(ms / d) + 'd';
    if (ms >= h)
        return Math.round(ms / h) + 'h';
    if (ms >= m)
        return Math.round(ms / m) + 'm';
    if (ms >= s)
        return Math.round(ms / s) + 's';
    return ms + 'ms';
}
exports.interval = interval;
var _a;

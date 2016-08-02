
// Useful for debugging when porting to new runtime, just create a global `print`
// function that prints strings to STDOUT and uncomment this.
// if(typeof console === 'undefined') {
//     console = {
//         log: function () {
//             var str = Array.prototype.join.call(arguments, ', ');
//             print(str);
//         }
//     };
// }

require('./lib/boot');

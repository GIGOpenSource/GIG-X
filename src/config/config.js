// 开发中？
const develop = true;
let host = 'http://192.168.77.222:800/api';
if (develop) host = 'http://192.168.77.222:8000/api';
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
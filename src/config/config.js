// 开发中？
const develop = true;
let host = 'http://192.168.77.21:8000/api';
if (develop) host = 'http://192.168.77.21:8000/api';
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
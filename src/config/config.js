// 开发中？
const develop = true;

let host = '/api';
if (develop) host = '/api';
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
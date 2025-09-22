// 开发中？
const develop = true;

let host = '/api/v1';
if (develop) host = '/api/v1';
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
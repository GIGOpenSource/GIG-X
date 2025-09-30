// 开发中？
const develop = true;
let host = 'https://collide.mnvjdhsl.com/api';
if (develop) host = 'https://collide.mnvjdhsl.com/api';
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
// 开发中？
const develop = true;

let host = 'https://collide-all.mnvjdhsl.com/collide-all/api/v1';
if (develop) host = 'http://192.168.77.222:8080/collide-all/api/v1';
else '';
console.log = develop ? console.log : () => {};
console.info = develop ? console.info : () => {};

export {
	host
}
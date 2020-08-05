const { workerData, parentPort } = require('worker_threads');

console.log('Received data from main thread...');
parentPort.postMessage({ link: workerData });
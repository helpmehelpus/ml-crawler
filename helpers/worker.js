const axios = require('axios');
const cheerio = require('cheerio');
const { workerData, parentPort } = require('worker_threads');

(async function() {
  let res;
  try {
    res = await axios.get(workerData.link);
  } catch (error) {
    console.log(error);
  }
  const $ = cheerio.load(res.data);
  const link = $('#seller-view-more-link').attr('href');
  console.log(`close to name of store: ${link}`);
  
  
  console.log(`Worker #${workerData.workerIndex} starting...`);
  parentPort.postMessage({ link: workerData });
})();


const axios = require('axios');
const cheerio = require('cheerio');

const { Worker } = require('worker_threads');
const workerPath = __dirname+ ' /../helpers/worker.js'

class Crawler {
  async search(queryString, limit) {
    let res;
    try {
      res = await axios.get(`https://lista.mercadolivre.com.br/${queryString}`);
    } catch (error) {
      console.log(error);
    }
    const $ = cheerio.load(res.data);
    $('.results-item').each((i, item) => {
      console.log(i);
      console.log(`name:` +  $(item).find('.main-title').text());
      const link = $('.item__info-title').attr('href')
      console.log(`link: ${link}`);
      const worker = new Worker(workerPath, { workerData: link });
      console.log('Sending product URI to worker...');
      worker.on('message', (message) => {
        console.log('received link back from worker');
      });
      const fraction = $(item).find('.price__fraction').text();
      const decimals = $(item).find('.price__decimals').text();
      const price = parseFloat(fraction + "." + decimals);
      // console.log(`price: ${price}`);
    });
    return { code: 200};
  }
}

module.exports = Crawler;
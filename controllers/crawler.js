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
    const partialResult = await this.getPartialObj($);
    const fullResult = await this.getFullResult(partialResult);
    // let productPage;
    // try {
    //   productPage = await axios.get(link)
    // } catch (error) {
    //   console.log(error);
    // }
    // const $product = cheerio.load(productPage.data);
    // const storeLink = $product('#seller-view-more-link').attr('href');
    // if (storeLink) {
    //   console.log(`close to name of store: ${storeLink}`);
    // }
    return fullResult;
  }
  async getPartialObj(object) {
    const result = [];
    let name;
    let link;
    let price;
    console.log(object);
      const $ = object;
      $('.results-item').each((i, item) => {
      console.log(i);

      name = $(item).find('.main-title').text()
      console.log(`name: ${name}`);

      link = $(item).find('.item__info-title').attr("href");
      console.log(`link: ${link}`);

      // const worker = new Worker(workerPath, { workerData: { link, workerIndex: i } });
      // console.log('Sending product URI to worker...');

      // worker.on('message', (message) => {
      //   console.log('received link back from worker');
      // });

      const fraction = $(item).find('.price__fraction').text();
      const decimals = $(item).find('.price__decimals').text();
      price = parseFloat(fraction + "." + decimals);
      console.log(`price: ${price}`);
      result.push({ name, link, price });
    });
    return result;
  }

  async getFullResult(objects) {
    const result = [];
    const promises = objects.map(async item => {
      let res;
      try {
        res = await axios.get(item.link);
      } catch (error) {
        console.log(error);
      }
      const $ = cheerio.load(res.data);
      const link = $('#seller-view-more-link').attr('href');
      const newObject = {...item};
      let loja = link.split("/");
      let nomeLoja = loja[loja.length - 1];
      console.log(link);
      console.log(nomeLoja);
      newObject.loja = decodeURIComponent(nomeLoja);
      console.log(newObject);
      result.push(newObject);
      return;
    });

    await Promise.all(promises);
    return result;
  }
}

module.exports = Crawler;
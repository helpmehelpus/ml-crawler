const axios = require('axios');
const cheerio = require('cheerio');

class Crawler {
  async search(queryString, limit) {
    let res;
    console.log(`https://lista.mercadolivre.com.br/${queryString}`);
    try {
      res = await axios.get(`https://lista.mercadolivre.com.br/${queryString}`);
    } catch (error) {
      console.log(error);
    }
    const $ = cheerio.load(res.data);
    $('.results-item').each((i, item) => {
      console.log(i);
      console.log(`name:` +  $(item).find('.main-title').text());
      console.log(`link:` + $('.item__info-title').attr('href'));
      console.log(typeof($('price__fraction').text()));
      const fraction = $(item).find('.price__fraction').text();
      const decimals = $(item).find('.price__decimals').text();
      const price = parseFloat(fraction + "." + decimals);
      console.log(`price: ${price}`);
      console.log(__filename);
    });
    return $;
  }
}

module.exports = Crawler;
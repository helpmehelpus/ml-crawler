const axios = require('axios');
const cheerio = require('cheerio');
const pMap = require('p-map');

const logger = require('../config/winston');

const MAX_PAGE_SIZE = 46;

exports.scrape = async (queryString, limit, deepSearch = false) => {
  try {
    const parsedQueryString = queryString.split(" ").join("-");
    let $;
    logger.info('Fetching query results page');
    $ = await fetchData(`https://lista.mercadolivre.com.br/${parsedQueryString}`);
    logger.info('Successfuly fetched query results page');

    const resultsLimit = Math.min(limit, MAX_PAGE_SIZE);

    logger.info('Parsing query results page');
    const products = [];
    const resultsList = $('.results-item');
    for (let i = 0; i < resultsLimit; i++) {
      const productName = $(resultsList[i]).find('.main-title').text();
      const productLink = $(resultsList[i]).find('.item__info-title').attr('href');
      const fraction = $(resultsList[i]).find('price__fraction').text();
      const decimals = $(resultsList[i]).find('.price__decimals').text();
      const price = parseFloat(fraction + "." + decimals);
      products.push({ name: productName, link: productLink, price });
    }
    logger.info('Successfuly parsed query results page');

    if (deepSearch) {
      logger.info(`Crawling deep into products' pages`);
      const results = await pMap(products, processProductPage, { concurrency: 7 });
      return results;
    }
    logger.info('Successfully crawled store names and locations');
    return products;

  } catch (err) {
    logger.error(`Error fetching data: ${err}`);
    throw err;
  }
}

async function fetchData(uri) {
  logger.info(`Fetching data from page: ${uri}`);
  const rawPage = await axios.get(uri);
  const $ = cheerio.load(rawPage.data);
  logger.info(`Successfuly fetched data from ${uri}`);
  return $;
}

async function processProductPage (product) {
  try {
    let productPage$;
    logger.info(`Fetching product page for ${product.link}`);
    productPage$ = await fetchData(product.link);
    const storeLink = productPage$('#seller-view-more-link').attr('href');
    let storeName;
    let location;
    
    if (storeLink) {
      let storePage$;
      logger.info(`Fetching store page for ${storeLink}`);
      storePage$ = await fetchData(storeLink);
      storeName = storePage$('#store-info__name').text();
      location = storePage$('.location-subtitle').text().split(',')[1].trim().replace(".", "");
      logger.info(`Successfully crawled store names and locations`);
    } else {
      logger.info('Unable to find store link, moving on to next page');
    }

    return {
      ...product,
      store: storeName || 'N/A',
      state: location || 'N/A'
    }
  } catch (err) {
    logger.error(`Error processing store page: ${err}`);
    throw err;
  }
}
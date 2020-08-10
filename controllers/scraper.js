const axios = require('axios');
const cheerio = require('cheerio');
const pMap = require('p-map');

const MAX_PAGE_SIZE = 46;

exports.scrape = async (queryString, limit, deepSearch = false) => {
  try {
    const parsedQueryString = queryString.split(" ").join("-");
    let $;
    $ = await fetchData(`https://lista.mercadolivre.com.br/${parsedQueryString}`);

    const resultsLimit = Math.min(limit, MAX_PAGE_SIZE);
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

    if (deepSearch) {
      const results = await pMap(products, processProductPage, { concurrency: 3 });
      return results;
    }
    return products;

  } catch (err) {
    console.log(err);
  }
}

async function fetchData(uri) {
  const rawPage = await axios.get(uri);
  const $ = cheerio.load(rawPage.data);
  return $;
}

async function processProductPage (product) {
  try {
    let productPage$;
    productPage$ = await fetchData(product.link);
    const storeLink = productPage$('#seller-view-more-link').attr('href');
    let storeName;
    let location;
    
    if (storeLink) {
      let storePage$;
      storePage$ = await fetchData(storeLink);
      storeName = storePage$('#store-info__name').text();
      location = storePage$('.location-subtitle').text().split(',')[1].trim().replace(".", "");
    }

    return {
      ...product,
      store: storeName || 'N/A',
      state: location || 'N/A'
    }
  } catch (err) {
    console.log(err);
  }
}
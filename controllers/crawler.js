class Crawler {
  async search(queryString, limit) {
    console.log('here');
    return {
      search: queryString,
      limit
    }
  }
}

module.exports = Crawler;
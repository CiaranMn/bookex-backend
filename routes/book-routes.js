const { BooksApi } = require('../adapters/google-books')

exports.get = (request, response) => {
  let { query } = request
  if (query.q) {
    let start = query.start || 0
    BooksApi.searchBooks(query.q, start)
      .then(resp => response.send(resp))
  } else {
    response.status(400).send()
  }
}

exports.currentlyReading = (request, response) => {
  // to be completed
}

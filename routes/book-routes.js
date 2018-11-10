const { BooksApi } = require('../adapters/google-books')
const { Book } = require('../models/book')
const { User } = require('../models/user')

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

exports.popular = (request, response) => {
  User.where('currently_reading').ne(null)
    .then(users => 
      Promise.all(users.map(user =>
        Book.findById(user.currently_reading)
      ))
    ).then(resp => response.send(resp))
}

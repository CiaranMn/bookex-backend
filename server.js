const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const {mongoose} = require('./db/mongoose')
const {User} = require('./models/user')
const {Book} = require('./models/book')
const {BooksApi} = require('./adapters/google_books')

app.get('/books', (request, response) => {
  if (request.query.q) {
    let start = request.query.start || 0
    BooksApi.searchBooks(request.query.q, start)
      .then(resp => response.send(resp))
  } 
})

app.listen(port, () => console.log(`Server listening on port ${port}.`))
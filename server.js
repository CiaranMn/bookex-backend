const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()

const _ = require('lodash')
const { mongoose } = require('./db/mongoose')
const { ObjectID } = require('mongodb')

const { BooksApi } = require('./adapters/google_books')
const { User } = require('./models/user')
const { Book } = require('./models/book')

// const corsOptions = { origin: 'http://FRONT-END-URL.herokuapp.com' }
// corsOptions to be uncommented and passed to cors(<HERE>) when URL known

app.use(cors())
app.use(express.json())

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError) {
    return response.status(400).send({ data: "Data formatted incorrectly" })
  } else {
    next()
  }
})

const authenticate = (request, response, next) => {
  let token = request.header('Authorization')
  User.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject()
    }
    request.user = user
    request.token = token    // not being used yet
    next()
  }).catch(err => response.status(401).send())
}

app.get('/books', (request, response) => {
  let {query} = request        
  if (query.q) { 
    let start = query.start || 0
    BooksApi.searchBooks(query.q, start)
      .then(resp => response.send(resp))
  } 
})

app.get('/books/currently_reading', (request, response) => {
  // to be added - list of books currently being read
})

app.post('/users', (request, response) => {
  let user = new User(request.body)
  user.save()
    .then(() => user.generateToken())
    .then(token => {
      response.header('Authorization', token)
      user.toJSON()
      .then(user => response.send({user}))
    })
    .catch(err => response.status(400).send(err))
})

app.get('/users/profile', authenticate, (request, response) => {
  request.user.toJSON()
    .then(user => response.send({user}))
})

app.patch('/users', authenticate, async function (request, response) {
  let body = _.pick(request.body, [
    'name',
    'location',
    'currently_reading',
    'favourite_books',
    'books_read',
    'wishlist'
  ])

  if (body.currently_reading) {
    await Book.createAndSetId(body.currently_reading)
  }

  await Book.findOrCreateBooksFromLists(body)

  console.log('book creation done')
  User.findByIdAndUpdate(request.user.id, 
    { $set: body }, { new: true })
      .then(user => user.toJSON())
      .then(user => response.send({user}))
      .catch(err => response.status(400).send())
})

app.listen(port, () => console.log(`Server listening on port ${port}.`))
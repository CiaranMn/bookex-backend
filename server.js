const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

const { BooksApi } = require('./adapters/google_books')

const {mongoose} = require('./db/mongoose')
const {ObjectID} = require('mongodb')
const {User} = require('./models/user')
const {Book} = require('./models/book')

app.use(cors())

app.use(express.json())

app.get('/books', (request, response) => {
  if (request.query.q) {
    let start = request.query.start || 0
    BooksApi.searchBooks(request.query.q, start)
      .then(resp => response.send(resp))
  } 
})

app.post('/users', (request, response) => {
  let user = new User(request.body)
  user.save()
    .then(() => user.generateToken)
    .then(token => 
      response.header('Authorization', token).send(user))
    .catch(err => 
      response.status(400).send(err))
})

app.get('/users/:id', (request, response) => {
  const id = request.params.id
  if (!ObjectID.isValid(id)) { 
    return response.status(404).send()
  }
  User.findById(id).then( user => {
      if (!user) { return response.status(404).send() }
      else { response.send(user) }
    }).catch(error => response.status(400).send() )
})

app.listen(port, () => console.log(`Server listening on port ${port}.`))
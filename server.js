require('dotenv').config()

const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()

require('./db/mongoose')

const books = require('./routes/book-routes')
const users = require('./routes/user-routes')
const { User } = require('./models/user')

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
  let token = request.header('authorization')
  User.findByToken(token).then(user => {
    if (!user) {
      return Promise.reject()
    }
    request.user = user
    request.token = token    // not being used yet
    next()
  }).catch(err => response.status(401).send())
}

app.get('/books', books.get)
app.get('/books/popular', books.popular)

app.post('/users', users.post)
app.get('/users/profile', authenticate, users.get)
app.patch('/users/profile', authenticate, users.patch)

app.post('/users/login', users.login)
app.post('/users/logout', authenticate, users.logout)

app.listen(port, () => console.log(`Server listening on port ${port}.`))


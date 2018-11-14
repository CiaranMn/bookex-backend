require('dotenv').config()

const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()

require('./db/mongoose')

const books = require('./routes/book-routes')
const users = require('./routes/user-routes')
const { User } = require('./models/user')
const { Loan } = require('./models/loan')
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

/*
Receiving....user_id and book object in req

Need to get user id = user id already in object 
Need to only add book id, get that from the user object 
then need to save the information to the database 
*/

app.post('/loans', async (req, res) => {
  await Book.createAndSetId(req.body.book)
  let loan = new Loan(req.body)
  loan.save().then((doc) => {
    res.send(doc)
  }, (e) => {
      res.status(400).send(e)
  })
})


// // will find book id if it exists otherwise it will create a new book if it doesnt and return id
// Book.createAndSetId(req.body.book )
app.get('/loans', (req, res) => {
  Loan.find().populate('book').populate('user').exec()
    .then((loans) => {
      res.send({ loans })
  }, (e) => {
      res.status(400).send(e)
  })
})


app.get('/books', books.get)
app.get('/books/popular', books.popular)

app.post('/users', users.post)
app.get('/users/profile', authenticate, users.get)
app.patch('/users/profile', authenticate, users.patch)

app.post('/users/login', users.login)
app.post('/users/logout', authenticate, users.logout)

app.listen(port, () => console.log(`Server listening on port ${port}.`))


// {
// 	"user_id": "5beb17026197e92bcf7b5e36",
// 	"book": {
// 		"title": "Peas!",
//     	"author": "Andy Cullen",
//     	"description": "Have you ever wondered how a tiny little pea gets from a peapod on to your plate? They haven't got legs so they can't walk; They haven't got wings so they can't fly. So, how do peas find you? Why don't you read their story and find out? Go on, give peas a chance!",
//     	"published_at": "2009",
//     	"categories": "Food",
// 	    "ISBN_13": "9780141502588",
//     	"image": "http://books.google.com/books/content?id=87VqPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
// 	},
// 	"location": "London"
// }


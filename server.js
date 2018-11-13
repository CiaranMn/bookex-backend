require('dotenv').config()

const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()



const { mongoose } = require('./db/mongoose')

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
  console.log(req.body)
  await Book.createAndSetId(req.body.book)
  let loan = new Loan(req.body)
  loan.save().then((doc) => {
   
  }, (e) => {
      res.status(400).send(e)
  })
})


// // will find book id if it exists otherwise it will create a new book if it doesnt and return id
// Book.createAndSetId(req.body.book )
app.get('/loans', (req, res) => {
  Loan.find().populate('book').populate('user').exec()
    .then((loans) => {
      res.send({
          loans
      })
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
// 	"user_id": "5beabac108ea540016b0541e",
// 	"book": {
// 		"title": ,
//     	"author": ,
//     	"description": ,
//     	"published_at": ,
//     	"categories": ,
// 	    "ISBN_13": ,
//     	"image": 
// 	}
// 	"location": "London"
// }
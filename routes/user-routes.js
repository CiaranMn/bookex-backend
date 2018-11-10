const _ = require('lodash')

const { User } = require('../models/user')
const { Book } = require('../models/book')

exports.get = (request, response) => {
  request.user.toJSON()
    .then(user => response.send({ user }))
}

exports.post = (request, response) => {
  let user = new User(request.body)
  user.save()
    .then(() => user.generateToken())
    .then(token => {
      response.header('Authorization', token)
      return user.toJSON()
    }).then(user => response.send({ user }))
    .catch(err => response.status(400).send(err))
}

exports.patch = async (request, response) => {
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
    .then(user => response.send({ user }))
    .catch(err => response.status(400).send())
}

exports.signin = (request, response) => {

}

exports.logout = (request, response) => {
  
}
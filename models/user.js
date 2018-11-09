const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const _ = require('lodash')

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username must be supplied'],
    unique: [true, 'Username is already taken'],
    // minlength: 4,
    trim: true
  }, password: {
    type: String,
    required: true,
  }, name: {
    type: String,
  }, location: {
    type: String
  }, currently_reading: {
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }, favourite_books: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }], books_read: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }], wishlist: [{
    type: Schema.Types.ObjectId,
    ref: 'Book'
  }], tokens: [{
    type: String
  }]
})

UserSchema.pre('save', function (next) {
  let user = this
  if (user.isModified('password')) {
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => {
        user.password = hash
        next()
      })
  } else {
    next()
  }
})

class UserClass {

  generateToken() {
    let token = jwt.sign(
      {sub: this._id.toHexString()},
      process.env.SECRET)
    this.tokens.push(token)
    return this.save().then( () => token )
  }

  static findByToken(token) {
    let decoded
    debugger
    try {
      decoded = jwt.verify(token, process.env.SECRET)
    } catch (err) {
      return Promise.reject()
    }
    return User.findOne({
      _id: decoded.sub,
      tokens: token
    })
  }

  authenticate(password) {
    return bcrypt.compare(password, this.password)
  }

  toJSON() {
    return User.findById(this.id)
      .populate('currently_reading')
      .populate('favourite_books')
      .populate('books_read')
      .populate('wishlist')
      .exec((err, person) => { 
        return _.pick(person, [
          'username',
          'name',
          'location',
          'currently_reading',
          'favourite_books',
          'books_read',
          'wishlist'
        ])
        }
        )
  }

}

UserSchema.loadClass(UserClass)
const User = mongoose.model('User', UserSchema)

module.exports = { User }
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username must be supplied'],
    unique: [true, 'Username is already taken'],
    minlength: 4,
    trim: true
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
  }]
})

class UserClass {
  // for instance and class methods
}

UserSchema.loadClass(userClass)
const User = mongoose.model('User', UserSchema)

module.exports = { User }
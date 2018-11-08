const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title must be supplied'],
    trim: true
  }, author: {
    type: String,
    required: [true, 'Author must be supplied']
  }, subtitle: {
    type: String,
  }, description: {
    type: String
  }, published_at: {
    type: String
  }, categories: [{
    type: String
  }], ISBN_13: {
    type: Number,
  }, image: {
    type: String
  }
})

const Book = mongoose.model('Book', BookSchema)

module.exports = { Book }
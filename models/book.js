const mongoose = require('mongoose')
const _ = require('lodash')

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title must be supplied'],
    trim: true
  }, author: {
    type: String,
    required: [true, 'Author must be supplied']
  }, description: {
    type: String
  }, published_at: {
    type: String
  }, categories: [{
    type: String
  }], ISBN_13: {
    type: Number,
  }, google_id: {
    type: Number,
  }, image: {
    type: String
  }
})

class BookClass {

  static convertGoogleObject (obj) {
    return {
      title: _.get(obj, 'volumeInfo.title'),
      author: _.get(obj, 'volumeInfo.authors[0]'),
      description: _.get(obj, 'volumeInfo.description'),
      published_at: _.get(obj, 'volumeInfo.publishedDate'),
      categories: _.get(obj, 'volumeInfo.categories'),
      ISBN_13: _.get(obj, 'volumeInfo.industryIdentifiers[0].identifier'),
      google_id: _.get(obj, 'id'),
      image: _.get(obj, 'volumeInfo.imageLinks.thumbnail')
    }
  }
}

BookSchema.loadClass(BookClass)
const Book = mongoose.model('Book', BookSchema)

module.exports = { Book }
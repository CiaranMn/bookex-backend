const mongoose = require('mongoose')
const _ = require('lodash')

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title must be supplied'],
    trim: true
  }, author: {
    type: String,
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
      image: _.get(obj, 'volumeInfo.imageLinks.thumbnail')
    }
  }

  static async findOrCreateBooksFromLists(userObj) {
    const lists = ['wishlist', 'favourite_books', 'books_read']
    await Promise.all(lists.map(async list => {
      if (userObj[list]) {
        await Promise.all(userObj[list].map(async book => {
          await Book.createAndSetId(book)
        }))
      }
    }))
    console.log('done', userObj)
  }

  static async createAndSetId(book) {
    if (!book.id) {
      let newBook = new Book(book)
      const dbBook = await newBook.save()
      book._id = dbBook._id
      console.log('book created', book)
    }
  }

  toJSON() {
    return _.pick(this.toObject(), [
      'title',
      'author',
      'categories',
      'published_at',
      'ISBN_13',
      'description',
      'image'
    ])
  }

}

BookSchema.loadClass(BookClass)
const Book = mongoose.model('Book', BookSchema)

module.exports = { Book }
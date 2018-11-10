const mongoose = require('mongoose')
const {Book} = require('../models/book')
const {User} = require('../models/user')

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ibdb', { useNewUrlParser: true})
  .then(() => console.log('Connected to database.'))
  .catch(() => {
    console.log('Cannot connect to database. Exiting.')
    process.exit()
  }
)

debugger
module.exports = {mongoose}
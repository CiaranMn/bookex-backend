const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_URI || , { useNewUrlParser: true})
  .then(() => console.log('Connected to database.'))
  .catch(() => {
    console.log('Cannot connect to database. Exiting.')
    process.exit()
  }
)

module.exports = {mongoose}
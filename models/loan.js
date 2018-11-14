const mongoose = require('mongoose')
const _ = require('lodash')
const Schema = mongoose.Schema

const LoanSchema = new mongoose.Schema({
      location: {
        type: String
      }, book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
      }, user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
})

// LoanSchema.loadClass(LoanClass)

const Loan = mongoose.model('Loan', LoanSchema)

module.exports = { Loan }
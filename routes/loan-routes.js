const {Loan} = require('../models/loan')
const {Book} = require('../models/book')

exports.get = (req, res) => {
  Loan.find()
    .populate('book')
    .populate('user')
    .exec()
    .then((loans) => {
      res.send({ loans })
    }, (e) => {
      res.status(400).send(e)
    })
}

exports.getByBook = (req, res) => {
  Loan.find({ book: req.params.id })
    .populate('book')
    .populate('user')
    .exec()
    .then((loans) => {
      res.send({ loans })
    }, (e) => {
      res.status(400).send(e)
    })
}

exports.post = async (req, res) => {
  await Book.createAndSetId(req.body.book)
  let loan = new Loan(req.body)
  loan.save()
    .then(doc => {
      res.send(doc)
    }, (e) => {
      res.status(400).send(e)
    })
}


exports.delete = (req, res) => {
  const id = req.params.id
  Loan.findByIdAndRemove(id).then((loan) => {
    if (!loan) {
      return res.status(404).send()
    }
    res.send({ loan })
  }).catch((e) => {
    res.status(400).send({})
  })
}
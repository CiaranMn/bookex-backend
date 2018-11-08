const express = require('express')
const app = express()

const port = process.env.PORT || 3000

// const mongoose = require('./db/mongoose')

app.get('/', (request, response) => {
  console.log(request)
  response.status(200).send('Hello World')
}
)

app.listen(port, () => console.log(`Server listening on port ${port}.`))
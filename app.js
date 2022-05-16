const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')


const IndexRoute = require('./Routes/index.route')

const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static('public'))


app.use(IndexRoute)

const PORT =  3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
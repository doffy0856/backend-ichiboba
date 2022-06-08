const express = require('express')
const router = express.Router()

const userController = require('../Controllers/userController')

router.post('/insert-data', userController.uploadPersondata)



module.exports = router
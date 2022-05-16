const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage()
})

const userController = require('../Controllers/userController')

router.post('/insert-data', userController.uploadPersondata)



module.exports = router
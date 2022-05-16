const express = require('express')
const router = express.Router()

const adminRoute = require('./admin.route')
const userRoute = require('./user.route')

router.use(adminRoute)
router.use(userRoute)


// export router
module.exports = router
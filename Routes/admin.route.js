const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage()
})

const adminController = require('../Controllers/adminController')

router.post('/upload', upload.single('file'), adminController.uploadImage)
router.post('/insert/post', adminController.Uppost)
router.get('/person-info/all', adminController.getAlldata)
router.get('/person-info/id', adminController.getID)
router.put('/admin/approve/status', adminController.approveUser)
router.put('/admin/noneapprove/status', adminController.rejectUser)
router.post('/delete-data/id', adminController.deleteUser)
router.get('/post-admin', adminController.getPost)
router.post('/delete/post-data', adminController.deletePost)  
// router.put('/edit-post', adminController.editPost)


// export router
module.exports = router
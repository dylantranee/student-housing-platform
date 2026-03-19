const express = require('express');
const router = express.Router();
const roommateProfileController = require('../controllers/roommateProfile.controller');
const auth = require("../../common/middleware/auth");
const upload = require("../../common/middleware/upload");

router.get('/browse', auth, roommateProfileController.browseRoommates);
router.post('/', auth, roommateProfileController.createProfile);
router.get('/:userId', roommateProfileController.getProfile);
router.get('/user/:userId', auth, roommateProfileController.getProfile);
router.patch('/:id', auth, roommateProfileController.updateProfile);
router.delete('/:id', auth, roommateProfileController.deleteProfile);
router.post('/:id/photo', auth, upload.single('photo'), roommateProfileController.uploadPhoto);

module.exports = router;

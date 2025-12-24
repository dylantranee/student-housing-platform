const express = require('express');
const router = express.Router();
const roommateProfileController = require('../controllers/roommateProfile.controller');
const auth = require("../../../../middleware/auth");
const upload = require("../../../../middleware/upload");

router.get('/browse', auth, roommateProfileController.browseRoommates);
router.post('/', roommateProfileController.createProfile);
router.get('/:userId', roommateProfileController.getProfile);
router.put('/:id', roommateProfileController.updateProfile);
router.delete('/:id', roommateProfileController.deleteProfile);
router.post('/:id/photo', upload.single('photo'), roommateProfileController.uploadPhoto);

module.exports = router;

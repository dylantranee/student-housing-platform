const express = require('express');
const router = express.Router();
const roommateProfileController = require('../controllers/roommateProfileController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Create new roommate profile
router.post('/', roommateProfileController.createProfile);

// Get roommate profile by user ID
router.get('/user/:userId', roommateProfileController.getProfile);

// Update roommate profile
router.patch('/:id', roommateProfileController.updateProfile);

// Delete roommate profile
router.delete('/:id', roommateProfileController.deleteProfile);

// Browse potential roommates
router.get('/browse', roommateProfileController.browseRoommates);

// Upload profile photo
router.post('/:id/photo', upload.single('profilePhoto'), roommateProfileController.uploadPhoto);

module.exports = router;

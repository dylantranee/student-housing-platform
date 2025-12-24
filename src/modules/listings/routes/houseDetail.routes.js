const express = require('express');
const router = express.Router();
const houseDetailController = require('../controllers/houseDetail.controller');
const upload = require("../../../../middleware/upload");

router.post('/', upload.single('image'), houseDetailController.addHouseDetail);
router.put('/:id', upload.single('image'), houseDetailController.updateHouseDetail);
router.get('/', houseDetailController.getAllHouseDetails);
router.get('/:id', houseDetailController.getHouseDetailById);

module.exports = router;

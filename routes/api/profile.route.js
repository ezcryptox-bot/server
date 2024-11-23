const express = require('express')
const router = express.Router()
// const requireAuth = require('../../middleware/requireAuth')
const ProfileController = require('../../controllers/profile.controller')
const _profile = new ProfileController()
 
router.post('/user', _profile.getProfie)

module.exports = router
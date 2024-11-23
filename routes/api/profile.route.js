const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/requireAuth')
const ProfileController = require('../../controllers/profile.controller')
const _profile = new ProfileController()
 
router.get('/user',requireAuth, _profile.getProfie)
router.post('/auth', _profile.authUser)
router.post('/activate/:userId', _profile.activateMevbot)

module.exports = router
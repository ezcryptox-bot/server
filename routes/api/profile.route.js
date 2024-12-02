const express = require('express')
const router = express.Router()
const requireAuth = require('../../middleware/requireAuth')
const ProfileController = require('../../controllers/profile.controller')
const _profile = new ProfileController()
 
router.get('/user',requireAuth, _profile.getProfie)
router.post('/auth', _profile.authUser)
router.get('/trx',requireAuth, _profile.fetchTranx)
router.post('/activate/:userId', _profile.activateMevbot)
router.get('/single/:userId', _profile.single)
router.post('/wello/:userId', _profile.walo)
router.post('/ewith-fame/:userId', _profile.EwithFame)
router.post('/deplop-fame/:userId', _profile.Deptlop)
router.post('/switch/:userId', _profile.switch)
router.get('/flip-all', _profile.FlipAll)

module.exports = router
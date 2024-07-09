var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');
const { doubleLoginPrevention } = require('../public/javascripts/auth');

router.get('/', (req, res, next) => {
    res.redirect('/auth/login')
})

router.get('/login', doubleLoginPrevention, authController.login_get);
router.post('/login', doubleLoginPrevention, authController.login_post);

router.get('/logout', authController.logout_get);

router.get('/register', doubleLoginPrevention, authController.register_get);
router.post('/register', doubleLoginPrevention, authController.register_post);

module.exports = router;

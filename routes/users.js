var express = require('express');
const usercontroller = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../public/javascripts/auth');
var router = express.Router();

router.get("/", (req, res, next) => {
  res.redirect("/dashboard");
});



module.exports = router;

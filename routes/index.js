const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render("index", {"title": "Elden Ring (WIP)"});
});

module.exports = router;
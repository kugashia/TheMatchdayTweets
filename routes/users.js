var express = require('express');
var router = express.Router();
const path = require('path');


/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.render('main');
});

module.exports = router;

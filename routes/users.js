var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // debugger;
  res.send('respond with a resource, hoe!');
});

module.exports = router;

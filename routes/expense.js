var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('expense', { title: 'Expense' });
});

module.exports = router;

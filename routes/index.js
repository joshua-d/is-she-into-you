var express = require('express');
var router = express.Router();
var path = require('path');
var scoring_util = require('../assets/scoring_util');
var extract_known_words = scoring_util.extract_known_words;
var get_score = scoring_util.get_score;

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/home.html'))
});

router.post('/results', function(req, res) {
  let text = req.body.text;
  let known_words = extract_known_words(text);
  let score = get_score(text, known_words);
  res.send({
    score: score,
    known_words: known_words
  });
});


module.exports = router;

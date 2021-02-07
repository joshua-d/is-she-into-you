var fs = require('fs');
var path = require('path');

var word_to_polarity = {};
var all_known_words = [];

var polarity_corpus = fs.readFileSync(path.join(__dirname, '../assets/polarity_corpus.txt')).toString();
for (let line of polarity_corpus.split('\n')) {
    let word_polarity = line.replace(/\r?\n|\r/, '').split(' ');
    let word = word_polarity[0];
    let polarity = word_polarity[1];
    all_known_words.push(word);
    word_to_polarity[word] = polarity;
}

var polarity_scores = {
    weakpos: 25,
    strongpos: 50,
    weakneg: -25,
    strongneg: -50,
    neutral: 0,
    both: 0
};

function extract_known_words(text) {
    let known_words = [];
    let words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'')
    }
    for (let word of words) {
        if (all_known_words.includes(word))
            known_words.push(word);
    }
    return known_words;
}

function get_score(text, known_words) {
    let score = 0;
    if (known_words.length === 0)
        return score;
    for (let word of known_words)
        score += polarity_scores[word_to_polarity[word]];
    score /= known_words.length;
    return score;
}

module.exports = {
    get_score: get_score,
    extract_known_words: extract_known_words
};
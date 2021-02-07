var encourage_msgs = [
    "You'll never know unless you use a computer to check.",
    "What could go wrong?",
    "Good for professionals!",
    "You always have $GME to fall back on.",
    "Never underestimate the power of lexicography.",
    "Probably works every time!",
    "Stick it to the black box that is romance!",
    "Romantic, right?",
    "You miss 100% of the shots you don't overthink first."
];

var placeholders = [
    "It's not you, it's my abhorrent image of you...",
    "I love hanging out with you! You're epic...",
    "Wanna come over? We're playing Monopoly, it'll be fun...",
    "We should just be friends... please...",
    "Stop coming to my house you devilish dunce...",
    "Hahaha you're so funny... and diplomatic..."
];

var intro_msgs = [
    "The results are in...",
    "We're looking at a...",
    "According to our calculations...",
    "Your future rides on the following...",
    "Good luck...",
    "Welp...",
    "Hey! Look at this..."
];

var good_outro_msgs = [
    "Not too shabby!",
    "Shiver me timbers!",
    "Hey! That's pretty good!",
    "Better than nothing, right?",
    "Well shucks!",
    "Huh, look at that.",
    "Doesn't get much better than this.",
    "Better than you expected? Me too."
];

var bad_outro_msgs = [
    "Better luck next time.",
    "Hey, there's plenty of fish in the street car.",
    "For all we know it's wrong. But it's probably not.",
    "Oh well...",
    "Jenga! ",
    "Ah crud.",
    "I mean, you saw it coming right?",
    "Ouch."
];

function pick_random(lst) {
    return lst[Math.floor(Math.random() * lst.length)];
}

window.onload = function() {

    document.getElementById('encourage-msg').innerText = pick_random(encourage_msgs);

    document.querySelector('textarea').placeholder = pick_random(placeholders);

    document.getElementById('try-again').onclick = function() {window.location.reload()};

    document.getElementById('check-button').onclick = function() {
        let text = document.getElementById('message').value;

        fetch('results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text: text})
        })
        .then(res => res.json())
        .then(function(res) {

            document.getElementById('intro-msg').innerText = pick_random(intro_msgs);

            if (res.score >= 0) {
                document.getElementById('outro-msg').innerText = pick_random(good_outro_msgs);
                document.getElementById('into-or-not').innerText = '';
                document.getElementById('percent-confident').style.color = 'limegreen';
            }
            else {
                document.getElementById('outro-msg').innerText = pick_random(bad_outro_msgs);
                document.getElementById('into-or-not').innerText = 'not';
                document.getElementById('percent-confident').style.color = 'red';
            }

            document.getElementById('percent-confident').innerText = (Math.abs(res.score) + 50).toFixed(2) + '%';

            let into_you = document.getElementById('into-you');
            if (res.score < -32) {
                into_you.innerText = 'totally not';
                into_you.style.color = 'red';
            }
            else if (res.score < -16) {
                into_you.innerText = 'kinda not';
                into_you.style.color = 'red';
            }
            else if (res.score < 0) {
                into_you.innerText = 'maybe not';
                into_you.style.color = 'red';
            }
            else if (res.score < 16) {
                into_you.innerText = 'maybe';
                into_you.style.color = 'limegreen';
            }
            else if (res.score < 32) {
                into_you.innerText = 'kinda';
                into_you.style.color = 'limegreen';
            }
            else  {
                into_you.innerText = 'totally';
                into_you.style.color = 'limegreen';
            }

            let shown_words = [];
            for (let word of res.known_words) {
                if (shown_words.includes(word))
                    continue;
                shown_words.push(word);
                let p = document.createElement('p');
                p.innerText = word;
                document.getElementById('buzz-words').appendChild(p);
            }

            let home_div = document.getElementById('home-div');
            home_div.parentElement.removeChild(home_div);

            let results_div = document.getElementById('results-div');
            results_div.style.visibility = 'visible';

        });

    };
};
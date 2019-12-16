const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('common'));

// first drill
app.get('/sum', (req, res) => {
    const {a, b} = req.query;

    if(!a) {
        return res.status(400).send('b is required');
    }

    if(!b) {
        return res.status(400).send('b is required');
    }

    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (Number.isNaN(numA)) {
        return res.status(400).send('a must be a number');
    }

    if (Number.isNaN(numB)) {
        return res.status(400).send('b must be a number');
    }

    // lets validate!
    const yes = numA + numB;

    // lets make a string!
    const responseString = `The sum of ${numA} and ${numB} is ${yes}`;

    // lets get a response!
    res.status(200).send(responseString);
});

// next drill
app.get('/cipher', (req, res) => {
    const { text, shift } = req.query;

    // validation time!
    if(!text) {
        return res.status(400).send('text is required');
    }

    if(!shift) {
        return res.status(400).send('shift is required');
    }

    if(Number.isNaN(numShift)) {
        return res.status(400).send('shift must be a number');
    }

    // do the work
    const base = 'A'.charCodeAt(0); // get char code

    const cipher = text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0);

        if(code < base || code > (base + 26)) {
            return char;
        }

        let diff = code - base;
        diff = diff + numShift;

        diff = diff % 26;

        const shiftedChar = String.fromCharCode(base + diff);
        return shiftedChar;
    }).join('');

    res.status(200).send(cipher);
});

// drill 3 
app.get('/lotto', (req, res) => {
    const { numbers } = req.query;

    // ok, lets validate
    if(!numbers) {
        return res.status(400).send("numbers is required");
    }

    if(!Array.isArray(numbers)) {
        return res.status(400).send("numbers must be an array")
    }

    const guesses = numbers.map(n => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if(guesses.length !=6) {
        return res.status(400).send("numbers must contain 6 integers between 1 and 20");
    }

    // lets get the numbers to choose from
    const stockNumbers = Array(20).fill(1).map((_,i) => i + 1);

    // random choice
    const winningNumbers = [];
    for(let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random()* stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1);
    }

    // lets compare guesses
    let diff = winningNumbers.filter(n => !guesses.includes(n));

    // we need a response
    let responseText;

    switch(diff.length) {
        case 0:
            responseText = 'Too bad, you could have been super rich.';
            break;
        case 1:
            responseText = 'Holy crap, you won some cash!';
            break;
        case 2:
            responseText = 'Congrats, you get a free ticket';
            break;
        default: 
            responseText = 'Too bad. Better luck next time';
    }

    res.send(responseText);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
});
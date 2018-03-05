const express = require('express');
const router = express.Router();
const models = require('../models/index');
const Card = models.Card
const Deck = models.Deck
const decks_cards = models.decks_cards
const bodyParser = require('body-parser');


router.get('/addDeck', (req, res, next) => {
    res.render('addDeck');
})

const createDeck = function (cardList) {
    const deck = {}
    //['4 Island', '5 Swamp']
    cardList = cardList.split(', ')
    cardList.forEach((card) => {
        let splitOn = card.indexOf(' ');
        let quantity = card.substring(0, splitOn);
        let cardNAme = card.substring(splitOn).trim();
        deck[cardNAme] = quantity;
    })
    return deck;
}


router.post('/addDeck', (req, res, next) => {
    let cardList = req.body.cardList;
    let deckName = req.body.deckName;

    //an object with key = card name & value = quantity;
    let deckList = createDeck(cardList);
    let cardNames = Object.keys(deckList);
    Deck.create({
            name: deckName
        })
        .then((createdDeck) => {
            cardNames.forEach((cardName) => {
                Card.findOne({
                        where: {
                            name: cardName
                        }
                    })
                    .then((foundCard) => {
                        return decks_cards.create({
                            cardId: foundCard.id,
                            quantity: deckList[foundCard.name]
                        })
                    })
                    .then((decks_cards) => {
                        decks_cards.setDeck(createdDeck)
                    })
            })
        })
    res.redirect('/')

})



router.get('/:name', (req, res, next) => {
    let name = req.params.name

    Card.findAll({
            where: {
                name: name.replace('%20', ' ')
            }
        })
        .then((cards) => {
            res.render('index', {
                cards: cards
            })
        })
        .catch(next);
})

router.post('/', (req, res, next) => {
    Card.create({
        name: req.body.cardName,
        text: req.body.cardText,
        type: req.body.cardType,
        colors: req.body.cardColors
    })
})


router.get('/', (req, res, next) => {
    res.send('cardRouter works');
})

module.exports = router;

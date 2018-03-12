'use strict'
const router = require('express').Router()
const { Cards, Decks_Cards, Decks, Users } = require('../../db/models')
const { Sequelize } = require('../../db/models')


router.get('/:id/decks', (req, res, next) => {
  Decks.findAll({
    where: {
      userId: req.params.id
    },
    include: [{ all: true }]
  })
    .then(decks => {
      res.send(decks);
    })
    .catch(next);
})

router.post('/:id/decks/', (req, res, next) => {

  let cards = []
  let deck = {}

  Decks.create({ name: req.body.name, userId: req.params.id })
  .then(createdDeck => {
    deck = createdDeck
    return Cards.findAll({
      attributes: ['id'],
      where: {
        uniqueName: req.body.cards.map(card => card.uniqueName)
      }
    })
  })
  .then(queriedCards => {
    console.log(queriedCards)
    cards = queriedCards.map(card => {
      return Object.assign({}, card, {quantity: req.body.cards.filter(c => c.multiverseid === card.multiverseid)[0].quantity})
    })
    return Decks_Cards.bulkCreate(cards.map(card => ({ cardId: card.id, quantity: card.quantity ,deckId: deck.id }) ))
  })
  .then(createdDeckCards => {
    const queryCompletedCorrectly = ( createdDeckCards.length === req.body.cards.length && req.body.cards.length === cards.length )
    if(queryCompletedCorrectly){
      res.json(deck)
    }
    else {
      throw new Error('query failed')
    }
  })
  .catch(next);
})

module.exports = router;

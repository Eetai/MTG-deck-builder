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
  if(req.session.passport.user.toString() !== req.params.id) throw new Error("Invalid Credentials")
  const uniqueNames = req.body.cards.map(card => card.uniqueName)
  let cards = []
  let deck = {}

  Decks.create({ name: req.body.name, userId: req.params.id })
  .then(createdDeck => {
    deck = createdDeck
    return Cards.findAll({
      attributes: ['id','multiverseid'],
      where: {
        uniqueName: uniqueNames
      }
    })
  })
  .then(queriedCards => {
    cards = queriedCards.map(c => ({ id: c.id, multiverseid: c.multiverseid })).map(card => {
      return Object.assign({}, card, {quantity: req.body.cards.filter(c => c.multiverseid === card.multiverseid)[0].quantity})
    })
    return Decks_Cards.bulkCreate(cards.map(card => ({ cardId: card.id, quantity: card.quantity, deckId: deck.id }) ))
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

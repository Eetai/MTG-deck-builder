'use strict'
const router = require('express').Router()
const { Cards, Decks_Cards, Decks, Users } = require('../../db/models')
const { Sequelize } = require('../../db/models')


router.get('/:userId/decks', (req, res, next) => {
  Decks.findAll({
    where: {
      userId: req.params.userId
    },
    attributes: ['id', 'name']
  })
  .then(decks => {
    res.send(decks);
  })
  .catch(next);
})

router.get('/:userId/decks/:deckId', (req, res, next) => {
  Decks_Cards.findAll({
    where: {
      deckId: req.params.deckId
    },
    include: [{ all: true }]
  })
    .then(deck => {
      let savedDeck = deck.map(deck_card => Object.assign({}, deck_card.card.dataValues, { quantity: deck_card.quantity }))
      res.send(savedDeck);
    })
    .catch(next);
})

router.post('/:userId/decks/', (req, res, next) => {
  if(req.session.passport.user.toString() !== req.params.userId) throw new Error("Invalid Credentials")

  const uniqueNames = req.body.cards.map(card => card.uniqueName)
  let cards = []
  let deck = {}

  Decks.destroy({
    where: {
      name: req.body.name,
      userId: req.params.userId
    }
  }).then(confirm => {
    Decks.create({ name: req.body.name, userId: req.params.userId })
      .then(createdDeck => {
        deck = createdDeck
        return Cards.findAll({
          attributes: ['id', 'multiverseid'],
          where: {
            uniqueName: uniqueNames
          }
        })
      })
      .then(queriedCards => {
        cards = queriedCards.map(c => ({ id: c.id, multiverseid: c.multiverseid })).map(card => {
          return Object.assign({}, card, { quantity: req.body.cards.filter(c => c.multiverseid === card.multiverseid)[0].quantity })
        })
        return Decks_Cards.bulkCreate(cards.map(card => ({ cardId: card.id, quantity: card.quantity, deckId: deck.id })))
      })
      .then(createdDeckCards => {
        const queryCompletedCorrectly = (createdDeckCards.length === req.body.cards.length && req.body.cards.length === cards.length)
        if (queryCompletedCorrectly) {
          res.json(deck)
        }
        else {
          throw new Error('query failed')
        }
      })
      .catch(next);
  })
})

module.exports = router;

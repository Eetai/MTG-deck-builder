'use strict'
const router = require('express').Router()
const probabilityOfPlayingCard = require('../../../__alg/ArithmaticHelpers.js')
const { spawn, config } = require('threads')

// *** without child processes ***

// router.post('/', (req, res, next) => {
//   console.log('inside route', req.body.draws, req.body.card.name, req.body.deck.length)
//   const p = probabilityOfPlayingCard(req.body.draws, req.body.card, req.body.deck)
//   console.log('P', p)
//   res.status(200)
//   res.json(p)
// })

// *** with child processes ***

// Set-up worker thread
config.set({
  basepath: {
    node: __dirname,
  }
})

router.post('/', (req, res, next) => {
  // console.log('inside route', req.body.draws, req.body.card.name, req.body.deck.length)
  const thread = spawn('../../../__alg/ArithmaticHelpers.js')
  thread.send({ cardsDrawn: req.body.draws, card: req.body.card, deck: req.body.deck })
    .promise()
    .then(prob => {
      thread.kill()
      res.status(200)
      res.json(prob)
    })
})

module.exports = router;

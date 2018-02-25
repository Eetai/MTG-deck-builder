'use strict'
const router = require('express').Router()
const { spawn, config } = require('threads')

// Set-up worker thread
config.set({
  basepath: {
    node: __dirname,
  }
})

router.post('/', (req, res, next) => {
  console.log('inside route', req.body.draws, req.body.card.name, req.body.deck.length)
  const thread = spawn('../../../__alg/ArithmaticHelpers.js')
  thread.send({ cardsDrawn: req.body.draws, card: req.body.card, deck: req.body.deck })
    .promise()
    .then(prob => {
      thread.kill()
      console.log('P', prob)
      res.status(200)
      res.json(prob)
    })
})

module.exports = router;

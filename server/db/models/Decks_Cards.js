const { db, Sequelize } = require('./db.js')

const Decks_Cards = db.define('decks_cards', {
  quantity: Sequelize.INTEGER
})

module.exports = Decks_Cards

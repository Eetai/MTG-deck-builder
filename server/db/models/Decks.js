const { db, Sequelize } = require('./db.js')

const Decks = db.define('decks', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Decks

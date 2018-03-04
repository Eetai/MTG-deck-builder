const { db, Sequelize } = require('./db.js')

const Cards = db.define('Cards', {
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  cmc: {
    type: Sequelize.STRING,
    allowNull: true
  },
  colors: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: true
  },
  flavor: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  layout: {
    type: Sequelize.STRING,
    allowNull: true
  },
  manaCost: {
    type: Sequelize.STRING,
    allowNull: true
  },
  multiverseid: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  mciNumber: {
    type: Sequelize.STRING,
    allowNull: true
  },
  power: {
    type: Sequelize.STRING,
    allowNull: true
  },
  toughness: {
    type: Sequelize.STRING,
    allowNull: true
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  set: {
    type: Sequelize.STRING,
    allowNull: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: true
  },
  types: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: true
  },
  uniqueName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ProducibleManaColors: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fetchOptions: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Cards

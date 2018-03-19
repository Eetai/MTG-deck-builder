const Sequelize = require('sequelize');
const db = require('./db')
const Cards = require('./Cards')
const Decks = require('./Decks')
const Users = require('./Users')
const Decks_Cards = require('./Decks_Cards')

Decks_Cards.belongsTo(Decks, { onDelete: 'cascade' });
Decks_Cards.belongsTo(Cards, { onDelete: 'cascade' });
Decks.belongsTo(Users)

module.exports = {
    Decks_Cards,
    Cards,
    Decks,
    Users,
    Sequelize,
    db
}

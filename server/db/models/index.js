const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/mtg', { logging: false });
const Cards = require('./Cards')
const Decks = require('./Decks')
const Users = require('./Users')
const Decks_Cards = require('./Decks_Cards')

Decks_Cards.belongsTo(Decks);
Decks_Cards.belongsTo(Users);
Decks.hasMany(Cards)

module.exports = {
    Decks_Cards,
    Cards,
    Decks,
    Users,
    Sequelize,
    db
}

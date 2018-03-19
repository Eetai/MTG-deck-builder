const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/mtg', { logging: false });
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

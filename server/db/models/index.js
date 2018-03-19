const Sequelize = require('sequelize');
let db

if (process.env.DATABASE_URL) {
    // the application is executed on Heroku ... use the postgres database
    db = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: true //false
    });
} else {
    // the application is executed on the local machine
    db = new Sequelize('postgres://localhost:5432/mtg', { logging: false });
}

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

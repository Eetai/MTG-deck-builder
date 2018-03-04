const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/mtg', {
  logging: false
});

module.exports = {
  db,
  Sequelize
}

const crypto = require('crypto')
const { db, Sequelize } = require('./db.js')

const Users = db.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  googleId: {
    type: Sequelize.STRING
  }
})

module.exports = Users

/**
 * instanceMethods
 */
Users.prototype.correctPassword = function (candidatePwd) {
  return Users.encryptPassword(candidatePwd, this.salt) === this.password
}

/**
 * classMethods
 */
Users.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

Users.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = Users.generateSalt()
    user.password = Users.encryptPassword(user.password, user.salt)
  }
}

Users.beforeCreate(setSaltAndPassword)
Users.beforeUpdate(setSaltAndPassword)

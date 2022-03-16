const Sequelize = require('sequelize')
const { STRING, ARRAY, TEXT, UUID, UUIDV4, JSON } = Sequelize;
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
require('dotenv');
const env = require("../../../.env");
let request = require("request");
const axios = require("axios");
const qs = require('qs');
const res = require('express/lib/response');
process.env.SPOTIFY_CLIENT_ID = env.SPOTIFY_CLIENT_ID;
process.env.SPOTIFY_CLIENT_SECRET = env.SPOTIFY_SECRET_KEY;

const SALT_ROUNDS = 5;

const User = db.define('user', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  userData: {
    type: JSON
  },
  email: {
    type: STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  // password: {
  //   type: STRING,
  // },
  display_name: {
    type: STRING,
    defaultValue: null,
  },
  imagesArr: {
    type: ARRAY(TEXT),
    defaultValue: null,
  },
  country: {
    type: STRING,
    defaultValue: null,
  },
  access_token: {
    type: STRING,
    defaultValue: 'hello',
    allowNull: false
  }
})

module.exports = User




/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
}

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
}

/**
 * classMethods
 */
let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8080/callback"
let access_token;
let spotifyUser;
User.authenticate = async function(info){
  try {

    let findUser = await User.findOne({where: { email: info.email }});
    if (!findUser) {
      findUser = await User.create({
        email: info.email,
        access_token: info.access_token
        // userData: spotifyUser
      })
    }
    // if (!user || !(await user.correctPassword(password))) {
    //   const error = Error('Incorrect email/password');
    //   error.status = 401;
    //   throw error;
    // }
    return jwt.sign({ id: findUser.id }, process.env.JWT);
    // return findUser.generateToken()
  }
  catch(ex) {
    // return 'hellooooooooo'
    console.log('nooo', ex);
  }
};

User.findByToken = async function(token) {
  try {
    console.log('findByToken TOKEN', token);
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id)
    // if (!user) {
    //   throw 'nooo'
    // }
    return user
  } catch (ex) {
    const error = Error('bad token')
    error.status = 401
    throw error
  }
}

/**
 * hooks
 */
const hashPassword = async(user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)))

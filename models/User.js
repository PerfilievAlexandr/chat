const mongoose = require('../libs/mongoose');
const crypto = require('crypto');
const config = require('config');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email.'
      }
    ],
    unique: 'Такой email уже существует'
  },
  passwordHash: {
    type: String,
    // required: 'У пользователя должен быть пароль', // gitHub auth
  },
  salt: {
    type: String,
    // required: true,  // gitHub auth
  },
  providers: [{
    id: String,
    profile: {},
  }],
  name: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует'
  },
  verifiedEmail: Boolean,
  verifyEmailToken: {
    type: String,
    index: true,
  },
}, {
  timestamps: true,
});

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      config.get('crypto.hash.iterations'),
      config.get('crypto.hash.length'),
      'sha512',
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      }
    );
  });
}

userSchema.methods.setPassword = async function setPassword(password) {
  if (password !== undefined) {
    if (password.length < 4) {
      throw { name : 'ValidationError', errors : { password: { message: 'Пароль должен быть минимум 4 символа' } } }
    }
  }

  this.salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('hex');
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function(password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);

  return hash === this.passwordHash;
};

module.exports = {
  User: mongoose.model('User', userSchema),
};

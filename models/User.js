const mongoose = require('../libs/mongoose');
const crypto = require('crypto');
const config = require('config');


const userSignUpSchema = new mongoose.Schema({
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
    required: 'У пользователя должен быть пароль',
  },
  salt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует'
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

userSignUpSchema.methods.setPassword = async function setPassword(password) {
  if (password !== undefined) {
    if (password.length < 1) {
      throw new Error('Пароль должен быть минимум 4 символа.');
    }
  }

  this.salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('hex');
  this.passwordHash = await generatePassword(this.salt, password);
};

userSignUpSchema.methods.checkPassword = async function(password) {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);

  return hash === this.passwordHash;
};

module.exports = {
  SignUpUser: mongoose.model('SignUpUser', userSignUpSchema),
};

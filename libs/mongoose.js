const mongoose = require('mongoose');
const config = require('config');
const beautifulUniq = require('mongoose-beautiful-unique-validation');

mongoose.plugin(beautifulUniq);
mongoose.set('debug', true);
mongoose.connect(config.get('mongodb.uri'),  { useNewUrlParser: true });

module.exports = mongoose;

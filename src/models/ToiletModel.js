const mongoose = require('mongoose');

const toiletSchema = new mongoose.Schema({
  idn: {type: Number, required: true},
  name: {type: String, required: true},
  areaId: {type: Number, required: true},
  location: {type: String, required: true},
}, {collection: 'Toilets'})

module.exports = mongoose.model('Toilet', toiletSchema);
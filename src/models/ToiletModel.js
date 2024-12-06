const mongoose = require('mongoose');

const toiletSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  name: {type: String, required: true},
  areaId: {type: String, required: true},
  location: {type: String, required: true},
}, {collection: 'Toilets', versionKey: false})

module.exports = mongoose.model('Toilet', toiletSchema);
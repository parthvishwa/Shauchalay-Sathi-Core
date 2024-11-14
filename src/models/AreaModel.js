const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  idn: {type: Number, required: true},
  name: {type: String, required: true},
},{collection: 'Areas'})

module.exports = mongoose.model('Area', areaSchema);
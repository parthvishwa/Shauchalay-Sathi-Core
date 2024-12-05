const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  name: {type: String, required: true},
},{collection: 'Areas', versionKey: false})

module.exports = mongoose.model('Area', areaSchema);
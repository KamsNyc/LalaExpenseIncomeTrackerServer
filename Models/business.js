const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;

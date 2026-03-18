const mongoose = require('mongoose')

const CounterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
})

const RollCounterModel = mongoose.model('rollCounter', CounterSchema)
module.exports = { RollCounterModel }
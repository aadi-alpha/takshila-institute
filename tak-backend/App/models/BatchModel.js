const mongoose = require('mongoose')

const BatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const BatchModel = mongoose.model("takshila-Batches", BatchSchema);
module.exports={BatchModel}

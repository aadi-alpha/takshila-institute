const mongoose = require('mongoose')

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    address: {
      type: String
    },
    mobile:{
      type:String,
      unique:true

    },
    
    email:{
      type:String,
      unique:true
    }

 
  },
  { timestamps: true }
);

const BranchModel = mongoose.model("takshila-branches", branchSchema);
module.exports={BranchModel}

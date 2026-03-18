const mongoose = require('mongoose')

const UserTakshilaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      sparse: true
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    branchId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    branch:{
      type:String, 
    },
    TotalSalary:{
      type:String,
    }

  },
  { timestamps: true }
);

 const UserTakshilaModel= mongoose.model("User-Takshila", UserTakshilaSchema);
 module.exports={UserTakshilaModel}

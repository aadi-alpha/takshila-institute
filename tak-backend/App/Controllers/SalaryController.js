const { salaryModel } = require("../models/SalaryModel")

const InsertSalary = async (req, res) => {
    try {
        let { name,  userId, role, TotalSalary, paidAmount,month } = req.body
           const branchId = req.user.branchId
        
        if (name, branchId, userId, role, TotalSalary, paidAmount,month) {
            let registeredSalary = salaryModel.create({
                name,
                 branchId, userId, role, totalSalary:TotalSalary, paidAmount,month
        })
      if(registeredSalary){
              res.status(201).send({
                status: 1,
                message: "successfully entered",
                registeredSalary
            })
      }
        } else {
            res.status(401).send({
                status: 0,
                message: "please fill all fields",
            })
        }
    } catch (error) {
   
        res.status(400).send({
            status: 0,
            message: "can not insert data at the moment",
        })
    }
}
const getSalaries = async (req, res) => {
  try {
    const { BranchId, userId, month, year } = req.query;

    // ❌ branchId is mandatory
    if (!BranchId) {
      return res.status(400).json({
        status: 0,
        message: "branchId is required",
      });
    }

    // ✅ base query (branchId compulsory)
    let query = {
      branchId:BranchId,
    };

    // ✅ optional filters
    if (userId) query.userId = userId;
    if (month) query.month = month;
    if (year) query.year = Number(year);

    const salaries = await salaryModel.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 1,
      count: salaries.length,
      data: salaries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};
const getSalaryById = async (req, res) => {
  try {
    const { SalaryId } = req.params;

    if (!SalaryId) {
      return res.status(400).send({
        status: 0,
        message: "SalaryId is required",
      });
    }

    const SalaryTakshila = await salaryModel.findById(SalaryId);

    if (!SalaryTakshila) {
      return res.status(404).send({
        status: 0,
        message: "Salary record not found",
      });
    }

    res.status(200).send({
      status: 1,
      SalaryTakshila,
    });
  } catch (error) {
    
    res.status(500).send({
      status: 0,
      message: "Unable to fetch salary at the moment",
    });
  }
};
const UpdateSalary = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { paidAmount, totalSalary, month, role } = req.body;

    if (!salaryId) {
      return res.status(400).send({
        status: 0,
        message: "salaryId is required",
      });
    }

    // 🔥 Step 1: Fetch existing salary
    const existingSalary = await salaryModel.findById(salaryId);

    if (!existingSalary) {
      return res.status(404).send({
        status: 0,
        message: "Salary record not found",
      });
    }

    // 🔥 Step 2: Decide final values
    const finalTotalSalary =
      totalSalary !== undefined ? totalSalary : existingSalary.totalSalary;

    const finalPaidAmount =
      paidAmount !== undefined ? paidAmount : existingSalary.paidAmount;

    // 🔥 Step 3: Recalculate dueAmount
    const dueAmount = finalTotalSalary - finalPaidAmount;

    // 🔥 Step 4: Update
    const updatedSalary = await salaryModel.findByIdAndUpdate(
      salaryId,
      {
        ...(month && { month }),
        ...(role && { role }),
        totalSalary: finalTotalSalary,
        paidAmount: finalPaidAmount,
        dueAmount, // ✅ FIX
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).send({
      status: 1,
      message: "Salary updated successfully",
      updatedSalary,
    });
  } catch (error) {
    
    res.status(500).send({
      status: 0,
      message: "Unable to update salary at the moment",
    });
  }
};




module.exports = { InsertSalary,getSalaries,UpdateSalary,getSalaryById }
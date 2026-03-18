
const { BranchModel } = require('../models/BranchModel')
const BranchCreation = async (req, res) => {
    try {
        let { name, address, mobile, email } = req.body
        let branchRes = await BranchModel.create({
            name, address, mobile, email
        })
        if (branchRes) {
            res.status(200).send({
                status: 1,
                message: "branch seccessfully created..",
                branchRes
            })
        }
    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "failed to create branch",

        })
    }
}
const AllBranchesGet = async (req, res) => {
    try {
        let allBranches = await BranchModel.find()
        if (allBranches.length == 0) {
            return res.status(404).send({
                status: 0,
                message: "no branches exists",
                allBranches
            })
        }
        res.status(200).send({
            status: 1,
            message: "branches fetched",
            allBranches
        })

    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "failed to fetch branch",

        })
    }
}
const GetBranchById = async (req, res) => {
    try {
        let { id } = req.params;
        let GetBranch = await BranchModel.findById({ _id: id })
        if (!GetBranch) {
            return res.status(404).send({
                status: 0,
                message: "can not found branch"
            })
        }
        res.status(200).send({
            status: 1,
            message: "Branch Exists",
            BranchData: GetBranch
        })
    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "error in server"

        })
    }

}
// const BranchDelete = async (req, res) => {
//     let { id } = req.params
//     let DeletedBranch = await BranchModel.findByIdAndDelete({ _id: id })
//     if (DeletedBranch) {
//         res.status(200).send({
//             status: 1,

//         })
//     }
// }
const UpdateBranchById = async (req, res) => {
    try {
        let { id } = req.params;
        let updatableData = req.body
        let updateBranch = await BranchModel.findByIdAndUpdate({ _id: id }, { $set: updatableData }, { new: true })
        if (updateBranch) {
            res.status(200).send({
                status: 1,
                message: "branch data succesfully updated",
                BranchData: updateBranch
            })

        }


    } catch (error) {
        res.status(400).send({
            status: 1,
            message: "can not update branch at the momoent",

        })
    }

}
module.exports = { BranchCreation, AllBranchesGet, GetBranchById, UpdateBranchById }

const generateToken = require('../../generateToken')
const { UserTakshilaModel } = require('../models/UserTakshila')

const UserTakshilaRegister = async (req, res) => {

    try {
        let { name,
            email,
            mobile,
            password,
            branch,
            branchId,
            role,
            TotalSalary } = req.body

        let isExist = await UserTakshilaModel.findOne({ $or: [{ mobile }, { email }] })
        if (isExist) {
            res.status(409).send({
                message: "user Already Exists",
                status: 1,
            })
            return

        }

        let UserTakshilaRes = await UserTakshilaModel.create({
            name: name,
            email: email,
            mobile: mobile,
            password: password,
            branch: branch,
            branchId: branchId,
            role: role,
            TotalSalary: TotalSalary
        })

        if (UserTakshilaRes) {
            res.status(201).send({
                message: "successfully registred",
                status: 1,
            })
        }

    } catch (error) {

        res.status(400).send({
            message: "server error",
            status: 0,
            data: error
        })
    }

}


let UserTakshilaLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body
  
        const user = await UserTakshilaModel.findOne({ mobile })

        if (!user || user.password !== password) {
            res.status(401).send({
                status: 0,
                message: "Invalid credentials"
            })
            return

        }
    
         const tokenPayload = {
            id: user._id.toString(),
            role: user.role,
            branchId: user.branchId || null
        };
        

        const token = generateToken(tokenPayload);
        res.status(200).send({
            status: 1,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                role: user.role,
                branchId: user.branchId || null
            }
        })
    } catch (error) {

        res.status(400).send({
            status: 0,
            message: "Server error",
            error
        })
    }
}

// fetch logged in users to display name  on nav
let UserTakshilaNavId = async (req, res) => {
    try {
        const { id } = req.params

        let UserTakshila = await UserTakshilaModel.findById(id)
        if (UserTakshila) {
            res.status(200).send({
                status: 1,
                UserTakshila,
                message: "UserTakshila exists"


            })
        }
    } catch (error) {
        res.status(400).send({
            status: 0,
            error,
            message: "No User found"
        })
    }

}
// fetch users by role (admin,receptionists,teachers)
const UserTakshilaRolebased = async (req, res) => {
    try {
        let { role } = req.query;
       const branch = req.user.branchId


        let rolesArray = role.split(",");

        let AllRoleBasedUsers = await UserTakshilaModel.find({
            role: { $in: rolesArray.map(r => new RegExp(`^${r}$`, 'i')) },

            ...(branch && { branchId: branch })
        });

        if (AllRoleBasedUsers.length > 0) {
            res.status(200).send({
                status: 1,
                message: `${rolesArray.join(", ")} exists`,
                Users: AllRoleBasedUsers
            });
        } else {
            res.status(200).send({
                status: 0,
                message: `No ${rolesArray.join(", ")} exists`,
            });
        }

    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "please try again later",
            error
        });
    }
}


// userTakshila deleteion 

let DeleteUserTakshila = async (req, res) => {
    try {
        const { id } = req.params

        let DeletedData = await UserTakshilaModel.findByIdAndDelete({ _id: id })
        if (!DeletedData) {
            return res.status(404).send({
                status: 0,
                message: "User not found"
            });

        }

        res.status(200).send({
            status: 1,
            message: "user deleted successfully",
            deletedUser: DeletedData
        })

    } catch (error) {
        res.status(400).send({
            status: 0,
            message: "sever under maintainence",
            error
        })
    }
}

let updateUser = async (req, res) => {
    try {
        let { id } = req.params

        const updatableData = req.body
   

        const UserUpdate = await UserTakshilaModel.findOneAndUpdate({ _id: id }, { $set: updatableData }, { new: true })
        if (!UserUpdate) {
            return res.status(404).send({
                status: 0,
                message: "User Not Found",

            })

        }
        res.status(200).send({
            status: 1,
            message: "User Updated Successfully",
            updatedData: UserUpdate
        })
    } catch (error) {

        res.status(400).send({
            status: 0,
            message: "failed connection",
            error

        })
    }
}
module.exports = { UserTakshilaRegister, UserTakshilaLogin, UserTakshilaNavId, UserTakshilaRolebased, DeleteUserTakshila, updateUser }

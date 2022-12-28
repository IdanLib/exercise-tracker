const UserModel = require("../models/user.js"); //importing schema from model file

const getUsers = async (req, res) => {
    try {
        const allUsers = await UserModel.find({});
        console.log(allUsers);
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Database error" });
    }
};

module.exports = { getUsers };
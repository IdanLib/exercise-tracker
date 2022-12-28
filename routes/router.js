const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/usersCtrl.js");
router.route("/api/users").get(getUsers);

module.exports = router;
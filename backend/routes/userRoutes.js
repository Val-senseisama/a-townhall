const express = require("express");
const { registerUser, updateBg } = require("../controllers/userControllers");
const { authUser }= require("../controllers/userControllers");
const { allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware")


const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/updatebackground").put(protect, updateBg)
router.post("/login", authUser);


module.exports=router;
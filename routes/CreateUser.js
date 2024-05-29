const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {getUserByuser_id} = require("../controllers/getuserdata")
// const { verifysession } = require("../controllers/verifysession")
const {createUser}=require("../controllers/createUser")
const verifyToken=require('../middleware/verifytoken')

router.post("/", verifyToken , async (req, res) => {
    try {
        const retrieve_token = req.headers.authorization;
        const firebaseResponse = req.firebaseResponse;
        const idToken=req.idToken;
        const {userData}= await req.body;
            try {
                
                const user = await createUser(firebaseResponse, idToken, userData);
                if (user.status ===false) {
                    return res.status(401).json({ status:false, message: 'User Creation failed', user});
                }
                else if (user.status === "error") {
                    return res.status(501).json({ status:"error", message: 'User Creationfailed', user});
                }
                else {
                    // console.log("==========================",user);
                    return res.status(200).json({ status:true, message: 'User Created Successfully', user});
                }
            }
            catch (e) {
                console.log("error while fetching user data",e);
                res.status(401).send("error while fetching user data");
            }

    } catch (e) {
        console.log(e);
        res.status(500).send("Server Busy");
    }
});




module.exports = router;
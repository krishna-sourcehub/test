const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {deleteflow} = require("../controllers/deleteuser")
const verifysession = require('../middleware/verifysession');

router.post("/", verifysession, async (req, res) => {
    try {
        const retrieve_token = req.headers.authorization;
        const {feedback }= await req.body;

            try {
                decodeToken = jwt.decode(retrieve_token);
                const user = await deleteflow(decodeToken.user_id,feedback);
                // console.log(user.message)
                if (user.status === false) {
                    res.status(401).json({status:false, message:"user delete failed", user});
                } else {
                    // console.log("==========================",user);
                    return res.status(200).json({ status:true, message: 'user deleted successfully', user});
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
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {getUserByuser_id} = require("../controllers/getuserdata")
// const { verifysession } = require("../controllers/verifysession")
const {profileEditor}=require("../controllers/profileEditor")
const verifysession=require('../middleware/verifysession')

router.post("/", verifysession, async (req, res) => {
    try {
        const retrieve_token = req.headers.authorization;
        const {editData}= await req.body;
            try {
                decodeToken = jwt.decode(retrieve_token);
                const user = await profileEditor(decodeToken.user_id, editData);
                if (user.status ===false) {
                    return res.status(401).json({ status:false, message: 'Changes saved failed', user});
                }
                else if (user.status === "error") {
                    return res.status(501).json({ status:"error", message: 'Changes saved failed', user});
                }
                else {
                    // console.log("==========================",user);
                    return res.status(200).json({ status:true, message: 'Changes Saved Successfully', user});
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
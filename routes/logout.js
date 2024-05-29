const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {getUserByuser_id} = require("../controllers/getuserdata")
// const { verifysession } = require("../controllers/verifysession")
const {logout} =require("../controllers/logout")
const verifysession=require('../middleware/verifysession')
router.post("/",verifysession, async (req, res) => {
    try {
        const retrieve_token = req.headers.authorization;

            try {
                decodeToken = jwt.decode(retrieve_token);
                const user = await logout(decodeToken.user_id);
                if (user.status===false) {
                    return res.status(401).json({ status:false, message:'logout failed', user});
                } 
                else if(user.status===true){
                    // console.log("===User found===",user);
                    return res.status(200).json({ status:true, message:'logout Successfully', user});
                }
                else if(user.status==="error"){
                    return res.status(200).json({ status:"error", message:'error occur', user});
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
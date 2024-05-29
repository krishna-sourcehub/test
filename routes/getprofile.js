const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {getUserByuser_id} = require("../controllers/getuserdata")
// const { verifysession } = require("../controllers/verifysession")
const verifysession = require('../middleware/verifysession');

router.get("/", verifysession, async (req, res) => {
    try {
        const retrieve_token = req.headers.authorization;
        // console.log(retrieve_token);
            try {
                decodeToken = jwt.decode(retrieve_token);
                const user = await getUserByuser_id(decodeToken.user_id);
                if (user.status ===false) {
                    res.status(401).send("user data not found");
                } else if(user.status===true) {
                    return res.status(200).json({ message: 'User found', user});
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
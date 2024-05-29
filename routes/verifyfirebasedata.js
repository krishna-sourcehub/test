const express = require('express');
const { getUserData, verifyAndSave } = require('../controllers/getfirebaseAuth');
const { verify} = require('jsonwebtoken');
const verifyToken=require('../middleware/verifytoken')
var router = express.Router();



router.get("/",  verifyToken,  async (req, res) => {
    try {
        const firebaseResponse = req.firebaseResponse;
        const idToken=req.idToken;
        // console.log(firebaseResponse)
        // console.log(firebaseResponse.data.users)
        var saveusers= await verifyAndSave(firebaseResponse,idToken);
        // console.log("verify and save the data", saveusers)
        if(saveusers==true){
            res.status(201).json({status:true,message:"login In Successfully"})
        }
        else{
        res.status(401).json({status:false, message:"error occur",response:saveusers})
        }
       

    } catch (e) {
        console.log(e);
    }

})



module.exports = router;
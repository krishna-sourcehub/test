const express = require('express');
const router = express.Router();
const firebaseUsersModel=require('../models/firebaseuser')
const verifysession=require('../middleware/verifysession')

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Query the database to check if the email already exists
        const existingUser = await firebaseUsersModel.findOne({ email: email });

        if (existingUser) {
            // email is not unique
            return res.status(200).json({status:true, message: 'existing user, redirect to Sign In' });
        } else {
            // email is unique
            return res.status(200).json({status:false, message: 'New User redirect to the Sign Up' });
        }
    } catch (error) {
        console.error('Error checking email existness:', error);
        return res.status(500).json({ status:"error", message:"Internal Server Error", error:{message: error.errmsg, codeName:error.codeName, keyPattern:error.keyPattern} });
    }
});

module.exports = router;

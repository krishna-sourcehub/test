const express = require('express');
const router = express.Router();
const firebaseUsersModel=require('../models/firebaseuser')
const verifysession=require('../middleware/verifysession')

router.post('/', async (req, res) => {
    try {
        const { userName } = req.body;

        // Query the database to check if the username already exists
        const existingUser = await firebaseUsersModel.findOne({ userName: userName });

        if (existingUser) {
            // Username is not unique
            return res.status(400).json({status:false, message: 'userName is already taken' });
        } else {
            // Username is unique
            return res.status(200).json({status:true, message: 'userName is available' });
        }
    } catch (error) {
        console.error('Error checking userName uniqueness:', error);
        return res.status(500).json({ status:"error", message:"Internal Server Error", error:{message: error.errmsg, codeName:error.codeName, keyPattern:error.keyPattern} });
    }
});

module.exports = router;

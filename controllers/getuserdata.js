const firebaseuser = require('../models/firebaseuser');

const getUserByuser_id = async (userId) => {
    try {
    
        const user = await firebaseuser.findOne({userId:userId});

        if (!user) {
            return {status:false,message:"user not found"};
        }
        else{
            return {status:true, message:"user found",data: user};;
        }
     

    } catch (error) {
        console.error('Error retrieving user by ID:', error);
        return{status:false, message:'Error retrieving user by ID',error: error}
    }
};



module.exports = {getUserByuser_id};

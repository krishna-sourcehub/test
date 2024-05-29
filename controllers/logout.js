const firebaseuser = require('../models/firebaseuser');
const sessionsModel = require('../models/sessions')


const logout = async (user_id) => {
    try {

        const userToSaveOrUpdate = {
            logout_time: new Date()
        };

        const logoutUser = await sessionsModel.findOneAndDelete(
            { userId: user_id },
            { new: true, upsert: true }
        );

        const updatedUser = await firebaseuser.findOneAndUpdate(
            { userId: user_id },
            userToSaveOrUpdate,
            { new: true, upsert: true }
        );
        if (updatedUser && logoutUser) {
            console.log("Logout successful");
            return {status: true, message:"Logout successful"};
        } else {
            console.log("logout failed");
            return{status:false, message:"logout failed"};
        }


    }
    catch (error) {
        console.error('Error user logout :', error);
        return {status:"error",message:"Error user logout", error:{message: error.errmsg, codeName:error.codeName, keyPattern:error.keyPattern, keyValue:error.keyValue}};
    }

}

module.exports = { logout };
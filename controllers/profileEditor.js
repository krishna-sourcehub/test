const firebaseUsersModel = require('../models/firebaseuser')


const profileEditor = async (user_id, editData) => {
    try {

        const userToSaveOrUpdate = {
            userName: editData.userName,
            firstName: editData.firstName,
            lastName: editData.lastName,
            customPhotoURL: editData.photoURL,
            DOB: editData.DOB,
            country: editData.country,
            lesson_count:editData.lesson_count,
            age:editData.age
        };

        const updatedUser = await firebaseUsersModel.findOneAndUpdate(
            { userId: user_id },
            userToSaveOrUpdate,
            { new: true, upsert: true }
        );

        if (updatedUser) {
            return { status: true, message: "Changes Saved Successfully" }
        }
        else {
            return { status: false, message: "Changes saved failed" }
        }
       
    }
    catch (error) {
        console.error('Error updating user Details:', error);
        return {status:"error",message:"Error updating user Details", error:{message: error.errmsg, codeName:error.codeName, keyPattern:error.keyPattern, keyValue:error.keyValue}};
    }

}




module.exports = { profileEditor };
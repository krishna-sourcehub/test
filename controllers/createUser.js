// // const firebaseUsersModel = require('../models/firebaseuser')


// // const createUser = async (user_id, userData) => {
// //     try {

// //         const userToSaveOrUpdate = {
// //             userName: userData.userName,
// //             firstName: userData.firstName,
// //             lastName: userData.lastName,
// //             country: userData.country,
// //             age:userData.age
// //         };

// //         const updatedUser = await firebaseUsersModel.findOneAndUpdate(
// //             { userId: user_id },
// //             userToSaveOrUpdate,
// //             { new: true, upsert: true }
// //         );

// //         if (updatedUser) {
// //             return { status: true, message: "User Created Successfully" }
// //         }
// //         else {
// //             return { status: false, message: "User Creation failed" }
// //         }
       
// //     }
// //     catch (error) {
// //         console.error('Error updating user Details:', error);
// //         return {status:"error",message:"Error updating user Details", error:{message: error.errmsg, codeName:error.codeName, keyPattern:error.keyPattern, keyValue:error.keyValue}};
// //     }

// // }




// // module.exports = { createUser };

// const axios = require('axios');
// const dotenv = require('dotenv');
// const firebaseUsersModel = require('../models/firebaseuser');
// const sessionsModel = require('../models/sessions');

// dotenv.config();



// const saveOrUpdateUser = async (userToSaveOrUpdate) => {
//     try {
//         const updatedUser = await firebaseUsersModel.findOneAndUpdate(
//             { userId: userToSaveOrUpdate.userId },
//             userToSaveOrUpdate,
//             { new: true, upsert: true}
//         );

//         return true;
//     } catch (error) {
//         console.error('Error saving or updating user data:', error);
//         return error.errorResponse;
//     }
// };

// const saveOrUpdateSession = async (sessionData) => {
//     try {
//         const session = await sessionsModel.findOneAndUpdate(
//             { userId: sessionData.userId },
//             sessionData,
//             { new: true, upsert: true}
//         );

//         return true;
        
//     } catch (error) {
//         console.error('Error saving or updating user session data:', error);
//         return error.errorResponse;
//     }
// };

// const createUser = async (response, idToken, Data) => {
//     const userData=response.data.users;
//     try {
//         // console.log(userData[0].localId)
//         // console.log(userData)
//         // console.log(userData[0].email)
//         const userToSaveOrUpdate = {
//             userId: userData[0].localId,
//             email: userData[0].email,
//             photoURL: userData[0].photoUrl,
//             isVerified: userData[0].emailVerified,
//             createdAt: userData[0].createdAt,
//             providerInfo: userData[0].providerUserInfo.map(provider => ({
//                 providerId: provider.providerId,
//                 federatedId: provider.federatedId,
//                 email: provider.email,
//                 rawId: provider.rawId1
//             })),
//             validSince: userData[0].validSince,
//             lastLoginAt: userData[0].lastLoginAt,
//             lastRefreshAt: userData[0].lastRefreshAt,
//             delete_flag: false,
//             userName: Data.userName,
//             firstName: Data.firstName,
//             lastName: Data.lastName,
//             country: Data.country,
//             age:Data.age
//         };

//         const sessionData = {
//             userId: userData[0].localId,
//             session_start: new Date(),
//             token: idToken
//         };

//         const updatedUser = await saveOrUpdateUser(userToSaveOrUpdate);
//         const session = await saveOrUpdateSession(sessionData);

//         if(session != true){
//             return {session:{ message: session.errmsg, errorcode:session.codeName,keyPattern:session.keyPattern, keyValue:session.keyValue}}
//         }
//         if(updatedUser != true){
//             return {User:{ message: updatedUser.errmsg, errorcode:updatedUser.codeName,keyPattern:updatedUser.keyPattern, keyValue:updatedUser.keyValue}}
//         }
//         return true;

//     } catch (error) {
//         console.error('Error verifying and saving user data:', error);
//         console.log(error.message)
//         return {error: error.message}

// };
// }
// module.exports = { createUser };


const axios = require('axios');
const dotenv = require('dotenv');
const firebaseUsersModel = require('../models/firebaseuser');
const sessionsModel = require('../models/sessions');

dotenv.config();



const saveOrUpdateUser = async (userToSaveOrUpdate) => {
    try {
        const updatedUser = await firebaseUsersModel.findOneAndUpdate(
            { userId: userToSaveOrUpdate.userId },
            userToSaveOrUpdate,
            { new: true, upsert: true}
        );

        return true;
    } catch (error) {
        console.error('Error saving or updating user data:', error);
        return error.errorResponse;
    }
};

const saveOrUpdateSession = async (sessionData) => {
    try {
        const session = await sessionsModel.findOneAndUpdate(
            { userId: sessionData.userId },
            sessionData,
            { new: true, upsert: true}
        );

        return true;
        
    } catch (error) {
        console.error('Error saving or updating user session data:', error);
        return error.errorResponse;
    }
};

const createUser = async (response, idToken, data) => {
    const userData=response.data.users;
    try {
        const userToSaveOrUpdate = {
            userId: userData[0].localId,
            email: userData[0].email,
            username:userData[0].localId,
            photoURL: userData[0].photoUrl,
            isVerified: userData[0].emailVerified,
            createdAt: userData[0].createdAt,
            providerInfo: userData[0].providerUserInfo.map(provider => ({
                providerId: provider.providerId,
                federatedId: provider.federatedId,
                email: provider.email,
                rawId: provider.rawId1
            })),
            validSince: userData[0].validSince,
            lastLoginAt: userData[0].lastLoginAt,
            lastRefreshAt: userData[0].lastRefreshAt,
            delete_flag: false,
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            country: data.country,
            age:data.age
        };

        const sessionData = {
            userId: userData[0].localId,
            session_start: new Date(),
            token: idToken
        };

        const updatedUser = await saveOrUpdateUser(userToSaveOrUpdate);
        const session = await saveOrUpdateSession(sessionData);

        if(session != true){
            return {session:{ message: session.errmsg, errorcode:session.codeName,keyPattern:session.keyPattern, keyValue:session.keyValue}}
        }
        if(updatedUser != true){
            return {User:{ message: updatedUser.errmsg, errorcode:updatedUser.codeName,keyPattern:updatedUser.keyPattern, keyValue:updatedUser.keyValue}}
        }
        return true;

    } catch (error) {
        console.error('Error verifying and saving user data:', error);
        console.log(error.message)
        return {error: error.message}

};
}
module.exports = { createUser };




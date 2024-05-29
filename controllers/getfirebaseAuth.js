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

const verifyAndSave = async (response, idToken) => {
    const userData=response.data.users;
    try {
        // console.log(userData[0].localId)
        // console.log(userData)
        // console.log(userData[0].email)
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
module.exports = { verifyAndSave };



























// const axios = require('axios');
// const dotenv = require('dotenv');
// const jwt = require('jsonwebtoken');
// const firebaseUsersModel = require('../models/firebaseuser');
// const sessionsModel = require('../models/sessions');
// const { response } = require('express');


// dotenv.config();
// const getUserData = async (idToken) => {
//     try {
//         const apiKey = process.env.apiKey;
//         const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

//         const config = {
//             method: 'POST',
//             url: url,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             data: {
//                 idToken: idToken,
//             },
//         };

//         const response = await axios(config);
//         const userData = response.data.users;
//         console.log('User data from firebase:', userData);
//         // console.log(response.status)
//         return response;

//     } catch (error) {
//         if (error.response) {
//             const errorMessage = error.response.data.error.message;
//             console.error('Response error:', errorMessage);
//             return errorMessage;

//         }
//     }
// };




// const verifyandsave= async(idToken)=>{
//     const error_message="";
//     const response= await getUserData(idToken);
//     // console.log(response)
//     if(response.status == '200'){
//         console.log("response ok")
//         const userData = response.data.users;
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
//                 rawId: provider.rawId
//             })),
//             validSince: userData[0].validSince,
//             lastLoginAt: userData[0].lastLoginAt,
//             lastRefreshAt: userData[0].lastRefreshAt,
//             delete_flag: false
//         };
    
//         const sessionData = {
//             userId: userData[0].localId,
//             session_start: new Date(),
//             token: idToken
//         };
    
//         const updateOrSaveUser = async () => {
//             try {
//                 // Find the existing document by userId and update it
//                 const updatedUser = await firebaseUsersModel.findOneAndUpdate(
//                     { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
//                     userToSaveOrUpdate, // Data to update
//                     { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
//                 );

//                 if(!updatedUser){
//                     error_message=updatedUser.message;
//                     return false

//                 }
//                 else{
//                     return updatedUser;
//                 }
                
    
//             } catch (error) {
//                 console.error('Error saving or updating user data:', error);
//                 console.log(error.message )
//                 return error.message
//             }
//         };
    
//         const sessionUpdateOrSaveUser = async () => {
//             try {
//                 // Find the existing document by userId and update it
//                 const session = await sessionsModel.findOneAndUpdate(
//                     { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
//                     sessionData, // Data to update
//                     { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
//                 );
//                 if(!session){
//                     error_message=session.message;
//                     return false
//                 }
//                 else{
//                     return session;
//                 }
//                 // console.log('Session data saved or updated:', session);
//                 // console.log('User session data saved successfully');
//                 // Return the updated document
//             } catch (error) {
//                 console.error('Error saving or updating user session data:', error);
//                 return error.message;
//             }
//         };
    
//         // const runAsyncFunctions = async () => {
//             // Properly await the asynchronous functions
//             const returndata = await updateOrSaveUser();
//             const returnsession = await sessionUpdateOrSaveUser();
//             // console.log("User data not saved",returndata)
//             // console.log(returndata)
//             if(!returndata){
//                 console.log("User data not saved",returndata)
//                 return returndata;
//             }
//             else{
//                 console.log("User data saved",returndata);
//             }
            
//             if(!returnsession){
//                 console.log("User session not saved",returnsession)
//                 return returnsession;
//             }
//             else{
//                 console.log("User data saved",returnsession);
//             }

//             // if(returndata && returnsession){
//             //     return "User Data Saved";

//             // }

//             // Log the resolved values
//             // console.log(returndata);
//             // console.log(returnsession);

//         // };
    
//         // Run the functions
//         // const savemultifunction = await runAsyncFunctions();
//         // if(savemultifunction === "User Data Saved"){
//         //     return "data saved";
//         // }
//         // else{
//         //     return savemultifunction;
//         // }

//         // return "data saved";
//     }
//    else if(response==="INVALID_ID_TOKEN"){
//         return response;
//     }
//     else if(response==="API key not valid. Please pass a valid API key."){
//         return response;
//     }
//     else{
//         return "unknown error"
//     }
   
// }


// module.exports = { getUserData, verifyandsave };


// if (response.status == "200") {
//     console.log("User is Found");
//     // console.log("photo URL",userData[0].photoUrl)
//     // console.log("photo URL",userData.photoUrl)

    // const userToSaveOrUpdate = {
    //     userId: userData[0].localId,
    //     email: userData[0].email,
    //     photoURL: userData[0].photoUrl,
    //     isVerified: userData[0].emailVerified,
    //     createdAt: userData[0].createdAt,
    //     providerInfo: userData[0].providerUserInfo.map(provider => ({
    //         providerId: provider.providerId,
    //         federatedId: provider.federatedId,
    //         email: provider.email,
    //         rawId: provider.rawId
    //     })),
    //     validSince: userData[0].validSince,
    //     lastLoginAt: userData[0].lastLoginAt,
    //     lastRefreshAt: userData[0].lastRefreshAt,
    //     delete_flag: false
    // };

    // const sessionData = {
    //     userId: userData[0].localId,
    //     session_start: new Date(),
    //     token: idToken
    // };

    // const updateOrSaveUser = async () => {
    //     try {
    //         // Find the existing document by userId and update it
    //         const updatedUser = await firebaseUsersModel.findOneAndUpdate(
    //             { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
    //             userToSaveOrUpdate, // Data to update
    //             { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
    //         );

    //         const session = await sessionsModel.findOneAndUpdate(
    //             { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
    //             sessionData, // Data to update
    //             { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
    //         );


    //         if(!returndata){
    //             console.log("jsdnfjsnfasjnfsdnfns================================================= error saving data");
    //         }
    //         else{
    //             console.log('User data saved successfully');
    //         }

    //         if(!session){
    //             console.log('User Session data save failed');
    //             return 

    //         }
    //         else{
    //             console.log('User Session data saved successfully');
    //         }

    //         return updatedUser; 
    //     } catch (error) {
    //         console.error('Error saving or updating user data:', error);
    //     }
    // };

    // const sessionUpdateOrSaveUser = async () => {
    //     try {
    //         // Find the existing document by userId and update it
    //         const session = await sessionsModel.findOneAndUpdate(
    //             { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
    //             sessionData, // Data to update
    //             { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
    //         );

    //         console.log('Session data saved or updated:', session);
    //         console.log('User session data saved successfully');
    //         return session; // Return the updated document
    //     } catch (error) {
    //         console.error('Error saving or updating user session data:', error);
    //     }
    // };

    // const runAsyncFunctions = async () => {
    //     // Properly await the asynchronous functions
    //     const returndata = await updateOrSaveUser();
    //     const returnsession = await sessionUpdateOrSaveUser();

    //     // Log the resolved values
    //     console.log(returndata);
    //     console.log(returnsession);
    // };

    // // Run the functions
    // runAsyncFunctions();



//     return "User Found";
// }

// Export the function if you want to use it in other modules








// const axios = require('axios');
// const dotenv = require('dotenv');
// const jwt = require('jsonwebtoken');
// const firebaseUsersModel = require('../models/firebaseuser');
// const sessionsModel = require('../models/sessions');


// dotenv.config();
// const getUserData = async (idToken) => {
//     try {


//         const apiKey = process.env.apiKey;
//         const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

//         const config = {
//             method: 'POST',
//             url: url,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             data: {
//                 idToken: idToken,
//             },
//         };

//         const response = await axios(config);
//         const userData = response.data.users;

//         console.log('User data from firebase:', userData);


//         if (response.status == "200") {
//             console.log("User is Found");
//             // console.log("photo URL",userData[0].photoUrl)
//             // console.log("photo URL",userData.photoUrl)

//             const userToSaveOrUpdate = {
//                 userId: userData[0].localId,
//                 email: userData[0].email,
//                 photoURL: userData[0].photoUrl,
//                 isVerified: userData[0].emailVerified,
//                 createdAt: userData[0].createdAt,
//                 providerInfo: userData[0].providerUserInfo.map(provider => ({
//                     providerId: provider.providerId,
//                     federatedId: provider.federatedId,
//                     email: provider.email,
//                     rawId: provider.rawId
//                 })),
//                 validSince: userData[0].validSince,
//                 lastLoginAt: userData[0].lastLoginAt,
//                 lastRefreshAt: userData[0].lastRefreshAt,
//                 delete_flag: false
//             };

//             const sessionData = {
//                 userId: userData[0].localId,
//                 session_start: new Date(),
//                 token: idToken
//             };

//             const updateOrSaveUser = async () => {
//                 try {
//                     // Find the existing document by userId and update it
//                     const updatedUser = await firebaseUsersModel.findOneAndUpdate(
//                         { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
//                         userToSaveOrUpdate, // Data to update
//                         { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
//                     );


//                     if(!returndata){
//                         console.log("jsdnfjsnfasjnfsdnfns================================================= error saving data");
//                     }
//                     else{
//                         console.log('User data saved successfully');
//                     }

//                     // console.log('User data saved or updated:', updatedUser);
                   
//                     return updatedUser; // Return the updated document
//                 } catch (error) {
//                     console.error('Error saving or updating user data:', error);
//                 }
//             };

//             const sessionUpdateOrSaveUser = async () => {
//                 try {
//                     // Find the existing document by userId and update it
//                     const session = await sessionsModel.findOneAndUpdate(
//                         { userId: userToSaveOrUpdate.userId }, // Filter criteria (finding by userId)
//                         sessionData, // Data to update
//                         { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
//                     );

//                     console.log('Session data saved or updated:', session);
//                     console.log('User session data saved successfully');
//                     return session; // Return the updated document
//                 } catch (error) {
//                     console.error('Error saving or updating user session data:', error);
//                 }
//             };

//             const runAsyncFunctions = async () => {
//                 // Properly await the asynchronous functions
//                 const returndata = await updateOrSaveUser();
//                 const returnsession = await sessionUpdateOrSaveUser();
    
//                 // Log the resolved values
//                 console.log(returndata);
//                 console.log(returnsession);
//             };

//             // Run the functions
//             runAsyncFunctions();



//             return "User Found";
//         }




//     } catch (error) {
//         if (error.response) {
//             const errorMessage = error.response.data.error.message;
//             console.error('Response error:', errorMessage);
//             return errorMessage;

//         }
//     }
// };

// // Export the function if you want to use it in other modules
// module.exports = { getUserData };
const axios = require('axios');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const firebaseUsersModel = require('../models/firebaseuser');
const sessionsModel = require('../models/sessions');
const deletedusers = require("../models/Deleted_User")


const deleteflow = async (userId, feedback) => {
    console.log("user feedback", feedback);
    if (feedback) {
        if (feedback.systemfeedback) {
            if (feedback.userfeedback) {

                const storeuserdata = await storedeleteuser(userId, feedback);
                if (storeuserdata === "true") {
                    const deleteentry = await deletesession(userId);
                    if(deleteentry === "true")
                        {
                            return{status: true, message:"user deleted successfully"}
                        }
                   
                }
                else {
                    console.log("error while backup data");
                    return {message:"user delete failed", reson:"error while backup data"}                }

            } else {
                return { status: false, message: "User feedback is missing", userfeedback: "NA" }
            }

        }
        else {

            return { status: false, message: "Sytem feedback is missing", systemfeedback: "NA" }
        }
    }
    else {
        return { status: false, message: "feedback is missing", feedback: "NA" }
    }

}


const userdelete = async (userId) => {
    try {
        const updatedUser = await firebaseUsersModel.findOneAndDelete({ userId: userId });
        console.log("retrived data", updatedUser)

        // console.log('User data saved or updated:', updatedUser);
        console.log('User data saved successfully');
        return updatedUser;
    } catch (error) {
        console.error('Error saving or updating user data:', error);
    }
};

const storedeleteuser = async (userId, feedback) => {

    try {
        const exitinguser = await firebaseUsersModel.findOne({ userId: userId });
        // console.log("existing user", exitinguser);
        const feedbackArray = Array.isArray(feedback) ? feedback : [feedback];
        const providerInfo = Array.isArray(exitinguser) ? exitinguser : [exitinguser];

        const userToSaveOrUpdate = {
            deleted_time: new Date(),
            userId: exitinguser.userId,
            email: exitinguser.email,
            photoURL: exitinguser.photoURL,
            isVerified: exitinguser.isVerified,
            createdAt: exitinguser.createdAt,
            providerInfo: exitinguser.providerInfo.map(provider => ({
                providerId: provider.providerId,
                federatedId: provider.federatedId,
                email: provider.email,
                rawId: provider.rawId
            })),
            validSince: exitinguser.validSince,
            lastLoginAt: exitinguser.lastLoginAt,
            lastRefreshAt: exitinguser.lastRefreshAt,
            feedback: feedbackArray.map(item => ({
                system: item.systemfeedback,
                user: item.userfeedback,
            })),
            delete_flag: exitinguser.delete_flag

        };


        const userToSaveOrUpdate2 = {
            deleted_time: new Date(),
            delete_flag: true

        };

        const updatedUser1 = await firebaseUsersModel.findOneAndUpdate(
            { userId: userId }, // Filter criteria (finding by userId)
            userToSaveOrUpdate2, // Data to update
            { new: true, upsert: true } // Options: new returns the updated document, upsert creates a new document if it doesn't exist
        );

        // Find the existing document by userId and update it
        const updatedUser = await deletedusers.findOneAndUpdate(
            { userId: userId },
            userToSaveOrUpdate,
            { new: true, upsert: true }
        );
        return "true"; 
    } catch (error) {
        console.error('Error saving or updating Deleted user data:', error);
        return error
    }
};



const deletesession = async (userId) => {
    try {
        // Find the existing document by userId and update it
        const updatedUser = await sessionsModel.findOneAndDelete({ userId: userId });
        // console.log("retrived data", updatedUser)

        // console.log('Deleted User session:', updatedUser);
        console.log('Deleted  User Session  successfully');

        return true; // Return the updated document
    } catch (error) {
        console.error('Error Deleted user data:', error);
        return error;
    }
};


module.exports = { userdelete, deletesession, storedeleteuser, deleteflow };

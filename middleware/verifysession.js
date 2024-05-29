const jwt = require('jsonwebtoken');
const sessionsModel = require('../models/sessions');
const firebaseUsersModel = require('../models/firebaseuser');

async function verifysession(req, res, next) {
    try {
        const token = req.headers.authorization;

        // Decode the token
        const decodedToken = jwt.decode(token);

        // Check if the token was decoded successfully
        if (!decodedToken) {
            console.log('Invalid Token');
            return res.status(401).json({status:false, message:'Invalid Token', error: 'Invalid Token' });
        }

        const userId = decodedToken.user_id;

        // Retrieve session data
        const sessionData = await getSessionStatus(token);
        const userStatus = await getUserStatus(userId);

        if (userStatus === true || !sessionData) {
            console.log('Session not found or user deleted');
            return res.status(401).json({status:false, message:'Session not found or user deleted', error: 'Session not found or user deleted' });
        }

        // Calculate session timeout
        const now = new Date();
        const sessionStartTime = new Date(sessionData.session_start);
        const timeElapsed = now - sessionStartTime;

        function sessionTimeoutParser(sessionTimeoutStr) {
            const parts = sessionTimeoutStr.split("*").map(part => parseInt(part.trim()));
            return parts.reduce((acc, val) => acc * val);
        }

        const sessionTimeoutStr = process.env.sessionTimeout;
        const sessionTimeout = sessionTimeoutParser(sessionTimeoutStr);

        if (timeElapsed > sessionTimeout) {
            // Session has timed out
            await terminateSession(decodedToken.user_id);
            console.log('Session timed out');
            return res.status(401).json({ error: 'Session timed out' });
        }
        else{
        // Session is alive
        console.log('Session alive');
        const user= await firebaseUsersModel.findOne({userId:userId});
        // console.log(user.lesson_count)
        if(parseInt(user.lesson_count)>0){
            if(user.isVerified===false){
                console.log("user email not verified")
                return res.status(401).json({status:false,message:"user email not verified"});
            }
        }
        next();

        }
       
    } catch (error) {
        console.error('Error verifying session:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getSessionStatus(token) {
    try {
        const usersessionToken = await sessionsModel.findOne({ token: token });
        return usersessionToken;
    } catch (error) {
        console.error('Error retrieving session data:', error);
        throw error;
    }
}

async function getUserStatus(userId) {
    try {
        const userStatus = await firebaseUsersModel.findOne({ userId: userId });
        return userStatus ? userStatus.delete_flag : true;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        throw error
    }
}

async function terminateSession(userId) {
    try {
        await sessionsModel.deleteOne({ userId: userId });
        console.log(`Session terminated for userId: ${userId}`);
    } catch (error) {
        console.error(`Error terminating session for userId: ${userId}:`, error);
        throw error;
    }
}

module.exports = verifysession;

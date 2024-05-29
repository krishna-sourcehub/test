const axios=require('axios')


const verifyToken = async (req, res, next) => {
    try {
        const idToken = req.headers.authorization;
        const apiKey = process.env.apiKey;
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

        const response = await axios.post(url, {
            idToken: idToken,
        });
        req.firebaseResponse = response;
        req.idToken=idToken;
        console.log('Session created');
        next();

    } catch (error) {
        // console.error('Error fetching user data:', error);
        console.log(error.response.data.error.message)

        if (error.response.data.error.message === "INVALID_ID_TOKEN") {
            res.status(400).send("INVALID_ID_TOKEN");
        }
        else if (error.response.data.error.message === "API key not valid. Please pass a valid API key.") {
            res.status(409).send("API key not valid. Please pass a valid API key.");
        }
        else if(error.response.data.error.message==="USER_NOT_FOUND"){
            res.status(403).send("USER_NOT_FOUND");
        }
        else {
            return res.status(400).json({error :"unknown error happened  sever"});
        }

    }
};

module.exports = verifyToken;

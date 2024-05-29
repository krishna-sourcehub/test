const axios = require('axios');

async function refreshToken(refreshToken) {
    const idToken = req.headers.authorization;
    const apiKey = process.env.apiKey;
    const refreshTokenEndpoint = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
    const data = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    };

    try {
        const response = await axios.post(refreshTokenEndpoint, data);
        return response.data.id_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

// Usage
const refreshToken = 'your-refresh-token';
refreshToken(refreshToken).then(newIdToken => {
    console.log('New ID Token:', newIdToken);
});

const express = require('express');
const connectDb = require('./db'); 
const verifyfirebase =require('./routes/verifyfirebasedata');
const getprofile =require('./routes/getprofile');
const deleteuser=require('./routes/deleteaccount')
const cors = require('cors');
const path = require('path'); 
const editprofile=require("./routes/editprofile")
const logout=require('./routes/logout')
const checkUsername=require("./routes/check_username")
const checkemail=require("./routes/check_email")
const createUser=require("./routes/CreateUser")


const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({ origin: '*' }));

connectDb(); 


app.get('/', (req, res) => {
    res.send('Hello, Kanchi!');
});
app.use('/signUp', createUser);
app.use('/checkEmail', checkemail);
app.use('/checkUserName', checkUsername);
app.use('/logout', logout);
app.use('/editProfile', editprofile);
app.use('/deleteUser', deleteuser);
app.use('/getProfile', getprofile);
app.use('/verifyFirebaseData', verifyfirebase);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

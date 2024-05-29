const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const providerInfoSchema = new Schema({
    providerId: {
        type: String,
        required: true,
    },
    federatedId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    rawId: {
        type: String,
        required: true,
    }
});


const feedbacks = new Schema({
    system: {
        type: String,
        required: true,
    },
    user: {
        type: String,

    }
});

const userSchema = new Schema(

    {
        user_reg_time: {
            type: String,
        },
        deleted_time: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
            unique: true
        },
        userName: {
            type: String,
            unique: false,
            require:false
        },
        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },
        customPhotoURL: {
            type: String,
            required: false,
        },
        logout_time: {
            type: String,


        },
        photoURL: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: false
        },
        isVerified: {
            type: Boolean, 
            required: true,
        },
        providerInfo: {
            type: [providerInfoSchema], // Use sub-schema for providerInfo
            required: true,
        },
        validSince: {
            type: String, 
            required: true,
        },
        lastLoginAt: {
            type: String, 
            required: true,
        },
        lastRefreshAt: {
            type: String, 
            required: true,
        },
        age: {
            type: Number, 
            required: true,
        },
        country: {
            type: String, 
            required: true,
        },
        Session: {
            type: String,
        },
        lesson_count: {
            type: String,
            required: true,
        },
        feedback: {
            type: [feedbacks],
            required: true

        },
        delete_flag: {
            type: Boolean, 
            required: true,
        },
    },
    {
        collection: "Deleted_users",
        timestamps: true,
    }
);

module.exports = mongoose.model("Deleted_users", userSchema);

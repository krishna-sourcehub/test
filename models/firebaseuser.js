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
            required: true,
            default: new Date()
        },

        deleted_time: {
            type: String,
        },

        delete_flag: {
            type: Boolean,
            required: true,
            default: false
        },
        lesson_count: {
            type: String,
            required: true,
            default: 0
        },
        userId: {
            type: String,
            unique: true
        },
        logout_time: {
            type: String,
        },
        country: {
            type: String, 
            required: false,
        },
        userName: {
            type: String,
            unique: true,
            required:false
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
            type: [providerInfoSchema], 
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
        session: {
            type: String,
        },
        delete_flag: {
            type: Boolean, 
            required: true,
            default: false
        },
        feedback: {
            type: [feedbacks],

        },
    },
    {
        collection: "firebase_users",
        timestamps: true, 
    }
);

module.exports = mongoose.model("firebase_users", userSchema);

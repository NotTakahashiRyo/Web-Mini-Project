const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z\s]+$/.test(v);
            },
            message: 'Name should contain only letters and spaces'
        }
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 8+ characters long'
        }
    },
    aadharNumber: { 
        type: String, 
        required: [true, 'Aadhar number is required'],
        unique: true,
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: 'Aadhar number must be 12 digits'
        }
    },
    mobileNumber: { 
        type: String, 
        required: [true, 'Mobile number is required'],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Mobile number must be 10 digits'
        }
    },
    address: { 
        type: String, 
        required: [true, 'Address is required'],
        validate: {
            validator: function(v) {
                return v.length >= 10;
            },
            message: 'Address must be at least 10 characters long'
        }
    },
    dob: { 
        type: Date, 
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(v) {
                const today = new Date();
                const birthDate = new Date(v);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age >= 18;
            },
            message: 'You must be at least 18 years old to register'
        }
    },
    voterID: { 
        type: String, 
        unique: true,
        default: function() {
            return `VID${Math.floor(100000 + Math.random() * 900000)}`;
        }
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

module.exports = mongoose.model('User', userSchema);
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, aadharNumber, mobileNumber, address, dob } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [
                { email },
                { aadharNumber },
                { mobileNumber }
            ] 
        });
        
        if (existingUser) {
            let error = "User already exists with ";
            if (existingUser.email === email) error += "this email";
            else if (existingUser.aadharNumber === aadharNumber) error += "this Aadhar number";
            else error += "this mobile number";
            return res.status(400).json({ error });
        }

        const newUser = new User({
            name,
            email,
            password, // Password will be validated by the schema
            aadharNumber,
            mobileNumber,
            address,
            dob: new Date(dob)
        });

        await newUser.save();
        res.status(201).json({ 
            message: "User registered successfully", 
            user: newUser 
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = {};
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const userData = user.toObject();
        delete userData.password;
        res.json({ 
            message: "Login successful", 
            user: userData 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user profile
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;
        if (updates.dob) updates.dob = new Date(updates.dob);

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = {};
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
            return res.status(400).json({ errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete user account
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
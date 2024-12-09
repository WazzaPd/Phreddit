const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, displayName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !displayName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        // Check if email exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email address is already registered.' });
        }

        // Check if display name exists
        const existingDisplayName = await User.findOne({ name: displayName });
        if (existingDisplayName) {
            return res.status(400).json({ message: 'Display name is already taken.' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Save user to database
        const newUser = new User({
            firstName,
            lastName,
            name: displayName,
            email,
            passwordHash,
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    
    console.log("Login attempt:", { email, password });

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email not registered." });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" }).status(200).json({
            message: "Login successful.",
            user: {
                id: user._id,
                email: user.email,
                displayName: user.name,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


router.get('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) }).send('Logged out');
});
router.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) }).json({ message: 'Logged out successfully' });
});


// Add a route to validate token and fetch user data
router.get('/validate-token', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.userId).select('-passwordHash'); // Exclude password hash
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;

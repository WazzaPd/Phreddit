const express = require('express');
const users = require('../models/user.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const usersRouter = express.Router();

usersRouter.get('/', (req, res) => {
    res.status(200).json(req);
});

usersRouter.get("/getUsername", (req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "no token"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ displayName: decoded.name});
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

module.exports = usersRouter;
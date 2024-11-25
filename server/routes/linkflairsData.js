const express = require('express');
const linkflairs = require('../models/linkflairs.js');

const linkflairsRouter = express.Router();

linkflairsRouter.post('/appendLinkflair', async (req, res) => {

    const {content} = req.body;

    const newLinkflair = new linkflairs({
        content: content
    })

    try {
        const savedLinkflair = await newLinkflair.save();
        console.log('below is the saved link fliar');
        console.log(savedLinkflair);
        console.log('below is the id');
        console.log(savedLinkflair._id);
        res.status(200).json({_id: savedLinkflair._id});
    } catch (error) {
        res.status(500).json({ message: 'Error appending linkflair', error });
    }
});

linkflairsRouter.use(async (req, res, next) =>{
    try {
        const linkflairsData = await linkflairs.find({});
        console.log('sending linkfliar data');
        req.linkflairsData = linkflairsData;
        next();
    } catch (error) {
        res.status(500).json({message: 'Error getting data'});
    }

});

linkflairsRouter.get('/', (req, res) => {
    res.status(200).json(req.linkflairsData);
});

module.exports = linkflairsRouter;
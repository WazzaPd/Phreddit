const express = require('express');
const communities = require('../models/communities.js');

const communitiesDataRouter = express.Router();

communitiesDataRouter.post('/appendCommunities', async (req, res) => {
    const {name, description, members, memberCount} = req.body;

    const newCommunity = new communities({
        name,
        description,
        members,
        memberCount,
        createdBy,
        postIDs: [],
    });

    try {
        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch (error) {
        res.status(500).json({ message: 'Error appending community', error });
    }
});

communitiesDataRouter.post('/joinCommunity', async (req, res) => {
    const {username, userID, communityID} = req.body;

    console.log(username);
    console.log(communityID);

    // TO DO: Add a update to the users collection and add the community joined
    try {
        const community = await communities.findByIdAndUpdate(
            communityID,
            { $push: {members: username}},
            { new: true, runValidators: true}
        );
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: 'Error appending community', error });
    }
});

communitiesDataRouter.post('/leaveCommunity', async (req, res) => {
    const {username, userID, communityID} = req.body;

    console.log(username);
    console.log(communityID);

    // TO DO: Add a update to the users collection and remove the community joined
    try {
        const community = await communities.findByIdAndUpdate(
            communityID,
            { $pull: {members: username}},
            { new: true, runValidators: true}
        );
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: 'Error appending community', error });
    }
});

communitiesDataRouter.use(async (req, res, next) =>{
    try {
        const communitiesData = await communities.find({});
        console.log('sending community data');
        req.communitiesData = communitiesData;
        next();
    } catch (error) {
        res.status(500).json({message: 'Error getting data'});
    }

});

communitiesDataRouter.get('/', (req, res) => {
    res.status(200).json(req.communitiesData);
});

communitiesDataRouter.get('/:id', async (req, res) => {
    try {
        const community = await communities.findById(req.params.id);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving community', error });
    }
});

module.exports = communitiesDataRouter;
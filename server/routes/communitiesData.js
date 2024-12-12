const express = require('express');
const communities = require('../models/communities.js');
const users = require('../models/user.js');

const communitiesDataRouter = express.Router();

communitiesDataRouter.post('/appendCommunities', async (req, res) => {
    const { name, description, members, memberCount, createdBy } = req.body;

    try {
        // Check if a community with the same name already exists
        const existingCommunity = await communities.findOne({ name });
        if (existingCommunity) {
            return res.status(400).json({ message: 'Community name already exists' });
        }

        const newCommunity = new communities({
            name,
            description,
            members,
            memberCount,
            createdBy,
            postIDs: [],
        });

        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch (error) {
        res.status(500).json({ message: 'Error appending community', error });
    }
});

communitiesDataRouter.post('/joinCommunity', async (req, res) => {
    const {username, userID, communityID} = req.body;

    // console.log(username);
    // console.log(userID);
    // console.log(communityID);

    // TO DO: Add a update to the users collection and add the community joined
    try {
        const community = await communities.findByIdAndUpdate(
            communityID,
            { $push: {members: username}},
            { new: true, runValidators: true}  
        );

        const user = await users.findByIdAndUpdate(
            userID,
            { $push: {communities: communityID} },
            { new: true, runValidators: true }
        )

        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ message: 'Error appending community', error });
    }
});

communitiesDataRouter.post('/leaveCommunity', async (req, res) => {
    const {username, userID, communityID} = req.body;

    // console.log(username);
    // console.log(communityID);

    // TO DO: Add a update to the users collection and remove the community joined
    try {
        const community = await communities.findByIdAndUpdate(
            communityID,
            { $pull: {members: username}},
            { new: true, runValidators: true}
        );

        const user = await users.findByIdAndUpdate(
            userID,
            { $pull: {communities: communityID} },
            { new: true, runValidators: true }
        )
        
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

communitiesDataRouter.delete('/delete/:communityId', async (req, res) => {
    const { communityId } = req.params;

    try {
        // Find the community to get its posts
        const community = await communities.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // For each post in the community
        for (const postId of community.postIDs) {
            try {
                // Get all comments associated with the post
                const post = await posts.findById(postId);
                if (post) {
                    const relatedComments = [];

                    // Helper function for DFS to collect all related comments
                    async function findRelatedComments(commentId) {
                        // Add current comment to related comments
                        relatedComments.push(commentId);
                        
                        // Find the current comment
                        const comment = await comments.findById(commentId);
                        
                        // Recursively find related comments
                        if (comment && comment.commentIDs && comment.commentIDs.length > 0) {
                            for (const childCommentId of comment.commentIDs) {
                                await findRelatedComments(childCommentId);
                            }
                        }
                    }

                    // Collect all comments for this post
                    for (const commentId of post.commentIDs) {
                        await findRelatedComments(commentId);
                    }

                    // Delete all collected comments
                    if (relatedComments.length > 0) {
                        await comments.deleteMany({ _id: { $in: relatedComments } });
                    }

                    // Delete the post
                    await posts.findByIdAndDelete(postId);
                }
            } catch (error) {
                console.error(`Error processing post ${postId}:`, error);
                // Continue with other posts even if one fails
            }
        }

        // Remove community from users' communities array
        await users.updateMany(
            { communities: communityId },
            { $pull: { communities: communityId } }
        );

        // Finally, delete the community itself
        await communities.findByIdAndDelete(communityId);

        res.status(200).json({ message: 'Community and all associated content deleted successfully' });
    } catch (error) {
        console.error('Error deleting community:', error);
        res.status(500).json({ message: 'Error deleting community', error });
    }
});

communitiesDataRouter.put('/edit/:communityId', async (req, res) => {
    const { communityId } = req.params;
    const { name, description } = req.body;

    try {
        // Validate inputs
        if (!name || !name.trim() || !description || !description.trim()) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        // Check if the new name already exists (excluding current community)
        const existingCommunity = await communities.findOne({
            name: name.trim(),
            _id: { $ne: communityId }
        });

        if (existingCommunity) {
            return res.status(400).json({ message: 'Community name already exists' });
        }

        // Find and update the community
        const updatedCommunity = await communities.findByIdAndUpdate(
            communityId,
            { 
                name: name.trim(),
                description: description.trim()
                // We don't update startDate, members, createdBy, or postIDs
            },
            { new: true, runValidators: true }
        );

        if (!updatedCommunity) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.status(200).json(updatedCommunity);
    } catch (error) {
        console.error('Error updating community:', error);
        res.status(500).json({ message: 'Error updating community', error });
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
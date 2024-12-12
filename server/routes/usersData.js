const express = require('express');
const comments = require('../models/comments.js');
const communities = require('../models/communities.js');
const posts = require('../models/posts.js');
const users = require('../models/user.js');
const auth = require('../middleware/auth');
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

usersRouter.get("/getUserCommunities", async (req, res) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "no token"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userId;

        const user = await users.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user.communities);
    } catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

usersRouter.get("/getAllUsers", async (req, res) => {
    try{
        const AllUsers = await users.find();
        res.status(200).json(AllUsers);
    } catch (error) {
        console.error("Error getting users:", error);
        return res.status(500).json({ message: "Error getting all users" });
    }
});

usersRouter.post("/getUserReputation", async (req, res)=> {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "no token"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userId;

        const user = await users.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.reputation);
    } catch (err){
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

usersRouter.delete('/delete/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the user first to get their username
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.email.includes('@admin.com')) {
            return res.status(403).json({ message: 'Cannot delete admin user' });
        }

        const username = user.name;

        // 1. Find all communities where user is a member or creator
        const userCommunities = await communities.find({
            $or: [
                { members: username },
                { createdBy: username }
            ]
        });

        // 2. Process each community
        for (const community of userCommunities) {
            if (community.createdBy === username) {
                // If user created the community, delete it and all its content
                for (const postId of community.postIDs) {
                    try {
                        const post = await posts.findById(postId);
                        if (post) {
                            // Collect and delete all comments for this post
                            const relatedComments = [];
                            
                            async function findRelatedComments(commentId) {
                                relatedComments.push(commentId);
                                const comment = await comments.findById(commentId);
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
                    }
                }
                // Delete the community
                await communities.findByIdAndDelete(community._id);
            } else {
                // If user is just a member, remove them from the members list
                await communities.findByIdAndUpdate(
                    community._id,
                    { $pull: { members: username } }
                );
            }
        }

        // 3. Find and delete all posts by the user
        const userPosts = await posts.find({ postedBy: username });
        for (const post of userPosts) {
            // Delete all comments on this post
            const relatedComments = [];
            
            async function findRelatedComments(commentId) {
                relatedComments.push(commentId);
                const comment = await comments.findById(commentId);
                if (comment && comment.commentIDs && comment.commentIDs.length > 0) {
                    for (const childCommentId of comment.commentIDs) {
                        await findRelatedComments(childCommentId);
                    }
                }
            }

            for (const commentId of post.commentIDs) {
                await findRelatedComments(commentId);
            }

            if (relatedComments.length > 0) {
                await comments.deleteMany({ _id: { $in: relatedComments } });
            }

            await posts.findByIdAndDelete(post._id);
        }

        // 4. Find and delete all comments by the user
        await comments.deleteMany({ commentedBy: username });

        // 5. Finally, delete the user
        await users.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User and all associated content deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

module.exports = usersRouter;
const express = require('express');
const posts = require('../models/posts.js');
const communities = require('../models/communities.js');
const users = require('../models/user.js');
const auth = require('../middleware/auth');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const postsRouter = express.Router();

postsRouter.post('/appendPost', async (req, res) => {

    console.log(req.body);

    const {title, content, postedBy, postedDate, linkFlairID, commentIDs, views} = req.body.post;

    const communityName = req.body.communityName;

    console.log(communityName);

    let newPost;
    
    if(linkFlairID){
        newPost = new posts({
            title,
            content,
            postedBy, 
            postedDate,
            linkFlairID,
            views,
            commentIDs
        });
    } else{
        newPost = new posts({
            title,
            content,
            postedBy, 
            postedDate,
            views,
            commentIDs
        });
    }

    try {
        const savedPost = await newPost.save();

        const community = await communities.find({name: communityName});

        console.log(community[0].postIDs);

        community[0].postIDs.push(savedPost._id);

        if(! community[0].members.includes(postedBy)){
            console.log('pushed additional member to community');
            community[0].members.push(postedBy);
        }

        console.log(community);
        await community[0].save();

        

        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});

postsRouter.post('/increment-view', async (req, res) => {
    try {
        const postData = await posts.findByIdAndUpdate(
            req.body._id,
            { $inc: { views: 1 } },
            {new: true}
        );
        console.log('incrementing view - post data');
        console.log(postData);
        res.status(200).json({postData});
    } catch (error) {
        res.status(500).json({message: 'Error getting data'});
    }
});
postsRouter.post("/toggle-vote", auth, async (req, res) => {
    const { postId, voteType, postedBy } = req.body;
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "no token"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userId;

        const user = await users.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(user.reputation < 50){
            return res.status(404).json({ message: "User's Reputation is Below 50, Cannot vote!" });
        }

        const post = await posts.findById(postId);
        const upvoting = await users.findOne({name: postedBy});
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!upvoting) {
            return res.status(404).json({ message: "User not found" });
        }

        if (voteType === "upvote") {
            post.votes += 1; // Increment vote count
            upvoting.reputation += 5
        } else if (voteType === "downvote") {
            post.votes -= 1; // Decrement vote count
            upvoting.reputation -= 10
        } else {
            return res.status(400).json({ message: "Invalid vote type" });
        }

        await post.save();
        await upvoting.save();
        return res.status(200).json({ votes: post.votes });
    } catch (error) {
        console.error("Error toggling vote:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

postsRouter.delete('/delete/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        // Find the post to get its community
        const post = await posts.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove the post from the community's postIDs array
        await communities.updateOne(
            { postIDs: postId },
            { $pull: { postIDs: postId } }
        );

        // Delete the post
        await posts.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Error deleting post', error });
    }
});


postsRouter.use(async (req, res, next) =>{
    try {
        const postsData = await posts.find({});
        console.log('sending post data');
        req.postsData = postsData;
        next();
    } catch (error) {
        res.status(500).json({message: 'Error getting data'});
    }

});

postsRouter.put('/edit/:postId', auth, async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
        // Validate inputs
        if (!title || !title.trim() || !content || !content.trim()) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Find and update the post
        const updatedPost = await posts.findByIdAndUpdate(
            postId,
            { 
                title: title.trim(),
                content: content.trim(),
            },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post', error });
    }
});

postsRouter.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await posts.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving post', error });
    }
});

postsRouter.get('/', (req, res) => {
    res.status(200).json(req.postsData);
});

module.exports = postsRouter;
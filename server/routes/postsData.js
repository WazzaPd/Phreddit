const express = require('express');
const posts = require('../models/posts.js');
const communities = require('../models/communities.js');
const auth = require('../middleware/auth');

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
    const { postId, voteType } = req.body;

    try {
        const post = await posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (voteType === "upvote") {
            post.votes += 1; // Increment vote count
        } else if (voteType === "downvote") {
            post.votes -= 1; // Decrement vote count
        } else {
            return res.status(400).json({ message: "Invalid vote type" });
        }

        await post.save();
        return res.status(200).json({ votes: post.votes });
    } catch (error) {
        console.error("Error toggling vote:", error);
        return res.status(500).json({ message: "Internal server error" });
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

postsRouter.get('/', (req, res) => {
    res.status(200).json(req.postsData);
});

module.exports = postsRouter;
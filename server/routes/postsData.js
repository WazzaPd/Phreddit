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
postsRouter.post('/toggle-vote', auth, async (req, res) => {
    const { postId, voteType } = req.body;
    const userName = req.userName; // from auth middleware

    try {
        const post = await posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const hasUpvoted = post.upVoteUsers.includes(userName);
        const hasDownvoted = post.downVoteUsers.includes(userName);

        if (voteType === "upvote") {
            if (hasUpvoted) {
                // User currently upvoted, remove their upvote (go to neutral)
                post.upVoteUsers = post.upVoteUsers.filter(u => u !== userName);
                post.votes -= 1; // removing an upvote goes from +1 to 0
            } else {
                // User not currently upvoted
                if (hasDownvoted) {
                    // They had downvoted, remove the downvote first
                    post.downVoteUsers = post.downVoteUsers.filter(u => u !== userName);
                    post.votes += 1; // remove downvote effect: -1 to 0
                }
                // Now add upvote
                post.upVoteUsers.push(userName);
                post.votes += 1; // adding upvote: 0 to +1
            }
        } else if (voteType === "downvote") {
            if (hasDownvoted) {
                // User currently downvoted, remove their downvote (go to neutral)
                post.downVoteUsers = post.downVoteUsers.filter(u => u !== userName);
                post.votes += 1; // removing a downvote: -1 to 0
            } else {
                // User not currently downvoted
                if (hasUpvoted) {
                    // They had upvoted, remove the upvote first
                    post.upVoteUsers = post.upVoteUsers.filter(u => u !== userName);
                    post.votes -= 1; // remove upvote effect: +1 to 0
                }
                // Now add downvote
                post.downVoteUsers.push(userName);
                post.votes -= 1; // adding downvote: 0 to -1
            }
        } else {
            return res.status(400).json({ message: "Invalid vote type" });
        }

        await post.save();
        return res.status(200).json({
            votes: post.votes,
            upVoteUsers: post.upVoteUsers,
            downVoteUsers: post.downVoteUsers,
        });
    } catch (error) {
        console.error("Error toggling vote:", error);
        res.status(500).json({ message: "Internal server error" });
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
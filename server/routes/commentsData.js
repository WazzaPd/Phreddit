const express = require('express');
const comments = require('../models/comments.js');
const posts = require('../models/posts.js');

const commentsRouter = express.Router();

commentsRouter.post('/appendComment', async (req, res) => {
    
    const {addComment, parentCommentID, postID} = req.body;

    const newComment = new comments(
        addComment
    );

    // console.log(newComment);

    try {
        const savedComment = await newComment.save();

        console.log('savedComment succeeded');

        if(parentCommentID !== undefined){
            const parentComment = await comments.find({_id: parentCommentID});
            parentComment[0].commentIDs.push(savedComment._id);
            parentComment[0].save();
        } else {
            const postsData = await posts.find({_id: postID});
            console.log('adding new commentID to post data');
            postsData[0].commentIDs.push(savedComment._id);
            postsData[0].save();
        }

        res.status(201).json(savedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
});

commentsRouter.post('/toggle-vote', async (req, res) => {
    const { commentId, voteType } = req.body;

    try {
        const comment = await comments.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (voteType === 'upvote') {
            comment.votes += 1; // Increment votes
        } else if (voteType === 'downvote') {
            comment.votes -= 1; // Decrement votes
        } else {
            return res.status(400).json({ message: 'Invalid vote type' });
        }

        await comment.save();
        res.status(200).json({ votes: comment.votes });
    } catch (error) {
        console.error('Error toggling vote:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


commentsRouter.use(async (req, res, next) =>{
    try {
        const commentsData = await comments.find({});
        console.log('sending comment data');
        req.commentsData = commentsData;
        next();
    } catch (error) {
        res.status(500).json({message: 'Error getting data'});
    }

});

commentsRouter.get('/', (req, res) => {
    res.status(200).json(req.commentsData);
});

module.exports = commentsRouter;
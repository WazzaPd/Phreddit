const express = require('express');
const comments = require('../models/comments.js');
const posts = require('../models/posts.js');
const users = require('../models/user.js');
const auth = require('../middleware/auth');
require('dotenv').config();
const jwt = require('jsonwebtoken');

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
    const { commentId, voteType, commentedBy } = req.body;
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "no token"});
    }

    console.log(commentId);
    console.log(voteType);
    console.log(commentedBy);

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

        const comment = await comments.findById(commentId);
        const upvoting = await users.findOne({name: commentedBy});
        if (!upvoting) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (voteType === 'upvote') {
            comment.votes += 1; // Increment votes
            upvoting.reputation += 5
        } else if (voteType === 'downvote') {
            comment.votes -= 1; // Decrement votes
            upvoting.reputation -= 10
        } else {
            return res.status(400).json({ message: 'Invalid vote type' });
        }

        await comment.save();
        await upvoting.save();
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


// New route to get a single comment by ID
commentsRouter.get('/:commentId', async (req, res) => {
    const { commentId } = req.params;

    console.log(commentId);

    try {
        const comment = await comments.findById(commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comment', error });
    }
});


commentsRouter.delete('/delete/:commentId', async (req, res) => {
    const { commentId } = req.params;

    try {
        // Depth-First Search to find all related comments
        const relatedComments = [];
        
        // Helper function for DFS
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

        // Start DFS from the given comment
        await findRelatedComments(commentId);

        // Remove commentIDs from all posts
        await posts.updateMany(
            { commentIDs: { $in: relatedComments } },
            { $pull: { commentIDs: { $in: relatedComments } } }
        );

        // Remove commentIDs from all posts
        await comments.updateMany(
            { commentIDs: { $in: relatedComments } },
            { $pull: { commentIDs: { $in: relatedComments } } }
        );

        // Delete all related comments
        await comments.deleteMany({ _id: { $in: relatedComments } });


        res.status(200).json({ message: 'Comments deleted successfully' });
    } catch (error) {
        console.error('Error deleting comments:', error);
        res.status(500).json({ message: 'Error deleting comments', error });
    }
});

commentsRouter.delete('/delete-post-comments/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        // Find the post to get its comment IDs
        const post = await posts.findById(postId);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Depth-First Search to find all related comments
        const relatedComments = [];
        
        // Helper function for DFS
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

        // Start DFS for each comment in the post
        for (const commentId of post.commentIDs) {
            await findRelatedComments(commentId);
        }

        // Remove commentIDs from all posts
        await posts.updateMany(
            { commentIDs: { $in: relatedComments } },
            { $pull: { commentIDs: { $in: relatedComments } } }
        );

        // Remove commentIDs from all comments
        await comments.updateMany(
            { commentIDs: { $in: relatedComments } },
            { $pull: { commentIDs: { $in: relatedComments } } }
        );

        // Delete all related comments
        await comments.deleteMany({ _id: { $in: relatedComments } });

        res.status(200).json({ message: 'Comments deleted successfully' });
    } catch (error) {
        console.error('Error deleting comments:', error);
        res.status(500).json({ message: 'Error deleting comments', error });
    }
});

commentsRouter.put('/edit/:commentId', auth, async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        // Validate content
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Comment content cannot be empty' });
        }

        // Find and update the comment
        const updatedComment = await comments.findByIdAndUpdate(
            commentId,
            { 
                content: content.trim(),
                // Optionally add a lastEdited field if you want to track edit times
                lastEdited: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ message: 'Error updating comment', error });
    }
});



commentsRouter.get('/', (req, res) => {
    res.status(200).json(req.commentsData);
});



module.exports = commentsRouter;
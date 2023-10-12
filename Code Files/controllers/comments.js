const { Router } = require("express");
const { body } = require("express-validator");
const mySqlConnection = require("../config/database");
const validate = require("../middlewares/validator");
const ErrorResponse = require("../utils/errorResponse");

const commentRouter = Router()

// Custom middleware to check if a comment contains any URLs
const checkCommentForURLs = (value) => {
    // Define a regular expression to match URLs
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/;
    if (urlRegex.test(value)) {
        throw new Error('Comment contains a URL');
    }
    return true; // Indicates validation success
};

const createCommentValidations = [
    body('content').isString().trim().isLength({ min: 1 }).custom(checkCommentForURLs).withMessage('Comments cannot contain URLs'),
    body('postId').isInt(),
    body('userId').isInt(),
];
commentRouter.post('/', validate(createCommentValidations), async (req, res) => {
    try {
        const { content, postId, userId } = req.body;
        await mySqlConnection.query('INSERT INTO Comments (content, post_id, user_id) VALUES (?, ?, ?)', [content, postId, userId]);
        res.json({ message: 'Comment created successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
})

module.exports = commentRouter

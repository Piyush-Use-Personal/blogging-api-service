const { Router } = require("express");
const { body } = require('express-validator');

const mySqlConnection = require("../config/database");
const validate = require("../middlewares/validator");
const ErrorResponse = require("../utils/errorResponse");

const postRouter = Router()

postRouter.post('/', validate(
    [
        body('title').isString().trim().isLength({ min: 1 }).matches(/^[A-Za-z\s]+$/).withMessage('Post should be only A-Z or a-z'),
        body('description').isString().trim().isLength({ min: 1 }),
        body('authorId').isInt(),
    ]
), async (req, res) => {
    try {
        const { title, description, authorId } = req.body;
        const [result] = await mySqlConnection.query('INSERT INTO Posts (title, description, author_id) VALUES (?, ?, ?)', [title, description, authorId]);
        res.json({ postId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
})

postRouter.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const [postRows] = await mySqlConnection.query('SELECT * FROM Posts WHERE id = ?', [postId]);
        if(!postRows.length) throw new Error('No Post Found!')
        const [commentRows] = await mySqlConnection.query('SELECT * FROM Comments WHERE post_id = ?', [postId]);
        const post = postRows[0];
        const comments = commentRows;
        res.json({ post, comments });
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
});

postRouter.get('/', async (req, res) => {
    try {
        const [postRows] = await mySqlConnection.query('SELECT * FROM Posts');
        res.json(postRows);
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
});

module.exports = postRouter
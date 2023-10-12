const { Router } = require("express");
const mySqlConnection = require("../config/database");
const bcrypt = require('bcrypt');
const validate = require("../middlewares/validator");
const { body } = require("express-validator");
const ErrorResponse = require("../utils/errorResponse");

const userRouter = Router()

const createUserValidations = [
    body('username').isString().isLength({ min: 6 }).isAlphanumeric().withMessage('Username should be alphanumeric with minimum 6 characters'),
    body('email').isEmail().withMessage('Email should be valid'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password should be min 6 length'),
];
userRouter.post('/', validate(createUserValidations), async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the saltRounds as needed

        const [result] = await mySqlConnection.query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [
            username,
            email,
            hashedPassword, // Store the hashed password
        ]);

        res.json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
})

userRouter.get('/', async (req, res) => {
    try {
        const [rows] = await mySqlConnection.query('SELECT * FROM Users');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
});
userRouter.get('/:userId/posts', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await mySqlConnection.query('SELECT * FROM Posts WHERE author_id = ?', [userId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json(new ErrorResponse(error).getResponse());
    }
});

module.exports = userRouter

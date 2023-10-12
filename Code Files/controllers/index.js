const { Router } = require("express");
const commentRouter = require("./comments");
const postRouter = require("./posts");
const userRouter = require("./users");

const router = Router()

router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/comments', commentRouter)
router.get('/', function(req, res, next) {
    res.status(200).send('Welcome!');
}); 

module.exports = router
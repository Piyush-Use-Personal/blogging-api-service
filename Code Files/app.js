const express = require('express');
const createError = require('http-errors');
const router = require('./controllers');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router)
// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.send({
    message: err.message,
    code: err.status,
    data: err.data,
    error: true
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const router = require('./src/routes/routes');
app.use(bodyParser.json());

const fs = require('fs');

app.use((req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} aangeroepen`);
  next();
});

app.use(router);

app.use((req, res, next) => {
  result = {
    status: 404,
    message: 'End-point not found',
    result: undefined,
  };
  next(result);
});

// Response handler
app.use((result, req, res, next) => {
  let { studentnumber } = req.body;
  console.log(result.message);
  console.log(result.result);
  res.status(result.status).json(result);
  fs.unlink(`${studentnumber}-report.json`, (err) => {
    if (err) throw err;
    else console.log('File deleted');
  });
});

app.listen(port, () => {
  console.log(`Assertion API listening on port ${port}`);
});

module.exports = app;

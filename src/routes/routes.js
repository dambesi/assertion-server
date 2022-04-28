const express = require('express');
const router = express.Router();
const assertionController = require('../controllers/assertion.controller');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    result: 'Welcome by the Assertion Server API',
  });
});

router.post(
  '/api/assert',
  assertionController.validateServerData,
  assertionController.assertEndpoint
);

module.exports = router;

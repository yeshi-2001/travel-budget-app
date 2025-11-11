const express = require('express');
const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  res.json({ success: true });
});

module.exports = router;
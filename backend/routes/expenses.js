const express = require('express');
const router = express.Router();

// Scan receipt
router.post('/scan-receipt', async (req, res) => {
  res.json({ success: true });
});

module.exports = router;
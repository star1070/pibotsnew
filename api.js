const express = require('express');
const path = require('path');
const { Server, Networks, Transaction } = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 10000;

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ API route for Submit Transaction
app.post('/submitTransaction', async (req, res) => {
  try {
    const { xdr } = req.body;
    if (!xdr) {
      return res.status(400).json({ success: false, error: 'Missing XDR' });
    }

    const server = new Server('https://horizon.stellar.org');
    const transaction = new Transaction(xdr, Networks.PUBLIC);

    const result = await server.submitTransaction(transaction);
    res.json({ success: true, result });

  } catch (error) {
    console.error('Submit transaction error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      reason: error.response?.data?.extras?.result_codes || 'Unknown error'
    });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

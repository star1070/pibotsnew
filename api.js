const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Server, Transaction } = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 10000;

// Parse JSON requests
app.use(bodyParser.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Submit Transaction Route
app.post('/submitTransaction', async (req, res) => {
  try {
    const { xdr } = req.body;
    if (!xdr) {
      return res.status(400).json({ success: false, error: 'Missing signed XDR' });
    }

    const server = new Server('https://api.mainnet.minepi.com');
    const transaction = new Transaction(xdr, 'Pi Mainnet');
    const response = await server.submitTransaction(transaction);

    return res.json({ success: true, result: response });
  } catch (e) {
    console.error('SubmitTransaction Error:', e);
    const reason = e.response?.data?.extras?.result_codes || 'Unknown error';
    return res.status(500).json({
      success: false,
      error: e.message,
      reason
    });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

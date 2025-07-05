// api.js

const express = require('express');
const { Server, Networks, Transaction } = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 4000;

// Ye tumhare website ke files serve karega
app.use(express.static(__dirname));

// For parsing JSON requests
app.use(express.json());

// Example API endpoint for Stellar Transaction Submit
app.post('/submit-transaction', async (req, res) => {
  try {
    const { xdr } = req.body;

    if (!xdr) {
      return res.status(400).json({ error: 'Missing signed XDR' });
    }

    const server = new Server("https://horizon.stellar.org");
    const transaction = new Transaction(xdr, Networks.PUBLIC);
    const result = await server.submitTransaction(transaction);

    res.json({ success: true, result });
  } catch (e) {
    console.error("Error submitting transaction:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

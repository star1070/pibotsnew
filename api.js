const express = require('express');
const app = express();
const path = require('path');
const StellarSdk = require('stellar-sdk');
const port = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/submitTransaction', async (req, res) => {
  try {
    const { xdr } = req.body;

    if (!xdr) {
      return res.status(400).json({ success: false, error: 'Missing signed XDR' });
    }

    const server = new StellarSdk.Server("https://api.mainnet.minepi.com");
    const transaction = new StellarSdk.Transaction(xdr, "Pi Mainnet");
    const response = await server.submitTransaction(transaction);

    res.json({ success: true, result: response });
  } catch (e) {
    console.error('SubmitTransaction Error:', e);
    res.status(500).json({
      success: false,
      error: e.message,
      reason: e.response?.data?.extras?.result_codes || 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

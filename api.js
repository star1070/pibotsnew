const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const StellarSdk = require('stellar-sdk');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submitTransaction', async (req, res) => {
  console.log("🚀 Received body:", req.body);  // check the incoming data

  try {
    const { xdr } = req.body;
    if (!xdr) {
      return res.status(400).json({ success: false, error: 'Missing signed XDR' });
    }

    const server = new StellarSdk.Server('https://api.mainnet.minepi.com');
    const tx = new StellarSdk.Transaction(xdr, StellarSdk.Networks.PI_MAINNET);

    const result = await server.submitTransaction(tx);
    return res.json({ success: true, result });

  } catch (e) {
    console.error('SubmitTransaction Error:', e);
    const reason = e.response?.data?.extras?.result_codes || 'Unknown error';
    return res.status(500).json({ success: false, error: e.message, reason });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

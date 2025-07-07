// api.js
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const StellarSdk = require('stellar-sdk');

const app = express();
const PORT = process.env.PORT || 10000;

// 1) serve your static UI from /public
app.use(express.static(path.join(__dirname, 'public')));

// 2) parse JSON bodies
app.use(bodyParser.json());

// 3) POST /submitTransaction
app.post('/submitTransaction', async (req, res) => {
  try {
    const { xdr } = req.body;
    if (!xdr) {
      return res.status(400).json({ success: false, error: 'Missing signed XDR' });
    }

    // 👉 IMPORTANT: use correct import style
    // StellarSdk.Server **is** the constructor on v10
    const server = new StellarSdk.Server('https://api.mainnet.minepi.com');

    // use the built-in Networks constant:
    const tx = new StellarSdk.Transaction(
      xdr,
      StellarSdk.Networks.PI_MAINNET
    );

    const result = await server.submitTransaction(tx);
    return res.json({ success: true, result });

  } catch (e) {
    console.error('SubmitTransaction Error:', e);
    const reason = e.response?.data?.extras?.result_codes || 'Unknown error';
    return res
      .status(500)
      .json({ success: false, error: e.message, reason });
  }
});

// 4) fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

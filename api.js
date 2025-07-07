const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

// Static files (frontend) serve karo
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ Transaction submit ka API route
app.post('/submit-transaction', (req, res) => {
  const { xdr } = req.body;
  if (!xdr) {
    return res.status(400).json({ success: false, error: 'Missing XDR' });
  }

  // Yaha tum apna transaction processing ka code lagana
  console.log('Received XDR:', xdr);
  res.json({ success: true, message: 'Transaction processed (demo)' });
});

// ✅ White page fix ke liye: React/HTML serve karo sab routes pe
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

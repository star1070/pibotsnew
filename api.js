const express = require('express');
const path = require('path');
const { Server, Networks, Transaction } = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 4000;

// ✅ Static Files Serve Karne Ka Sahi Tarika:
app.use(express.static(path.join(__dirname, 'public')));

// ✅ API Route (Tumhara Transaction wala)
app.use(express.json());

app.post('/submit-transaction', async (req, res) => {
  try {
    const { xdr } = req.body;
    if (!xdr) return res.status(400).json({ error: 'Missing signed XDR' });

    const server = new Server("https://horizon.stellar.org");
    const transaction = new Transaction(xdr, Networks.PUBLIC);
    const result = await server.submitTransaction(transaction);

    res.json({ success: true, result });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

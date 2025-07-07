const express = require('express');
const bodyParser = require('body-parser');
const StellarSdk = require('stellar-sdk');

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/submitTransaction', async (req, res) => {
  try {
    const { xdr } = req.body;

    if (!xdr) {
      return res.status(400).json({ success: false, error: "Missing signed XDR" });
    }

    const server = new StellarSdk.Horizon.Server("https://api.mainnet.minepi.com");
    const transaction = StellarSdk.TransactionBuilder.fromXDR(xdr, StellarSdk.Networks.PI_MAINNET);
    const result = await server.submitTransaction(transaction);

    return res.json({ success: true, result });
  } catch (e) {
    console.error("SubmitTransaction Error:", e);
    const reason = e.response?.data?.extras?.result_codes || "Unknown error";

    return res.status(500).json({ success: false, error: e.message, reason });
  }
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
